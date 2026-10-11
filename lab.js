import { generatePassword, characterSets, classifyTicket, visibleTasks, changeTask } from './lab-core.js';

const configs = {
  helpdesk: { name: 'HelpDesk IA', intro: 'De un incidente a una respuesta organizada.', repo: 'helpdesk-ia', boundary: 'Demo local con reglas deterministas. El análisis de IA está simulado; no se envían tickets ni se consulta Gemini.', guide: ['Elige un incidente de ejemplo o escribe uno ficticio.', 'Analiza la clasificación y revisa los pasos sugeridos.', 'Crea el ticket y resuélvelo desde la bandeja.'], limits: 'Esta edición muestra el recorrido de soporte. No ejecuta el backend Express, Prisma ni el modelo de IA del proyecto original.' },
  passforge: { name: 'PassForge', intro: 'Generar. Organizar. Mantener el control.', repo: 'passforge-nextjs-prisma', boundary: 'Generador local con Web Crypto. Bóveda ficticia en memoria: sin cuenta, persistencia, cifrado de bóveda ni sincronización. No usar como gestor de credenciales reales.', guide: ['Ajusta longitud y grupos de caracteres.', 'Genera una clave y prueba mostrarla u ocultarla.', 'Añade un registro de ejemplo a la bóveda temporal y comprueba el reinicio.'], limits: 'La generación es real y usa aleatoriedad criptográfica. La bóveda es una demostración temporal; no reproduce la autenticación o el almacenamiento del proyecto Next.js.' },
  gamerhub: { name: 'GamerHub', intro: 'Encuentra tu próxima partida.', repo: 'gamerhub-frontend', boundary: 'Catálogo y jugadores ficticios. Favoritos temporales en tu navegador; sin login, API, chat ni conexión a MongoDB.', guide: ['Busca un juego o filtra por género.', 'Guarda juegos en tu lista y abre Solo favoritos.', 'Explora los perfiles ficticios y reinicia para recuperar el catálogo.'], limits: 'Una edición independiente para explorar catálogo y favoritos. No consume RAWG ni el backend original y no crea cuentas o relaciones reales.' },
  taskapi: { name: 'Task API', intro: 'Un flujo de trabajo, varias responsabilidades.', repo: 'task-rest-api', boundary: 'Simulación local de tareas y vistas por rol. Los endpoints y permisos mostrados son ejemplos; no existe autenticación real en esta demo.', guide: ['En vista Administrador crea una tarea para un integrante.', 'Cambia a vista Empleado y selecciona ese integrante.', 'Actualiza el estado y observa la respuesta HTTP simulada.'], limits: 'Los datos son ficticios. La selección de rol demuestra la interfaz; la autorización real debe hacerse en el backend Laravel, que no se ejecuta aquí.' }
};
const requested = new URLSearchParams(location.search).get('project') || document.body.dataset.app || 'helpdesk';
const key = Object.hasOwn(configs, requested) ? requested : 'helpdesk';
const config = configs[key];
document.body.dataset.project = key;
document.title = `${config.name} · Demo interactiva · Lucas Nieto`;
document.querySelector('#app-name').textContent = config.name;
document.querySelector('#app-intro').textContent = config.intro;
document.querySelector('#breadcrumb').textContent = `PRODUCT LAB / ${config.name.toUpperCase()}`;
document.querySelector('#demo-boundary').textContent = config.boundary;
document.querySelector('#source-link').href = `https://github.com/Gecko2087/${config.repo}`;
document.querySelectorAll('#lab-nav a').forEach(a => { a.classList.toggle('active', new URL(a.href).searchParams.get('project') === key); if (a.classList.contains('active')) a.setAttribute('aria-current', 'page'); });
const root = document.querySelector('#app-root');
const toast = text => { document.querySelector('#toast').textContent = text; };
const node = (tag, text, className) => { const item = document.createElement(tag); if (text !== undefined) item.textContent = text; if (className) item.className = className; return item; };
const button = (text, onClick, className = '') => { const item = node('button', text, className); item.type = 'button'; item.addEventListener('click', onClick); return item; };
const badge = (text, type = '') => node('span', text, `badge ${type}`);
const empty = text => node('p', text, 'empty');
const dialog = document.querySelector('#guide-dialog');
config.guide.forEach(text => document.querySelector('#guide-steps').append(node('li', text)));
document.querySelector('#guide-limits').textContent = config.limits;
document.querySelector('#guide-title').textContent = `Prueba ${config.name}`;
document.querySelector('#guide-button').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-guide').addEventListener('click', () => dialog.close());
document.querySelector('#reset-button').addEventListener('click', () => { render(); toast('Demo reiniciada. Se eliminaron los cambios de esta sesión.'); });

function stat(label, value, accented = false) { const item = node('div', undefined, `stat${accented ? ' accent' : ''}`); item.append(node('strong', String(value)), node('span', label)); return item; }

function helpdesk() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">SUPPORT / INTELLIGENCE</p><h2>Menos ruido.<br>Más resolución.</h2><p class="muted">Un recorrido completo: describir, clasificar, priorizar y resolver.</p></div><span class="badge done">Clasificador de demostración</span></div><div class="stats" id="hd-stats"></div><div class="split"><section class="panel"><div class="panel-title"><h3>Bandeja de tickets</h3><small>WORKSPACE / DEMO</small></div><label for="hd-filter">Estado</label><select id="hd-filter"><option value="all">Todos los tickets</option><option value="open">Abiertos</option><option value="done">Resueltos</option></select><div id="ticket-list" class="ticket-list mt-15"></div></section><section class="panel"><div class="panel-title"><h3>Nuevo incidente</h3><span>✦</span></div><p class="muted small">Prueba un escenario:</p><div class="scenario-buttons" id="scenarios"></div><form id="ticket-form"><label for="ticket-title">Título</label><input id="ticket-title" maxlength="100" required value="No puedo acceder al CRM"><label for="ticket-description">Descripción ficticia</label><textarea id="ticket-description" maxlength="1000" required>No puedo iniciar sesión en el CRM. Mi cuenta muestra un error de acceso.</textarea><div class="form-actions"><button type="button" id="analyze-ticket">Analizar ejemplo ✦</button><button class="primary" type="submit">Crear ticket ↗</button></div></form><div id="ticket-analysis" class="analysis-box" aria-live="polite"></div></section></div>`;
  const tickets = [ {id:101,title:'VPN sin conexión para el equipo',category:'Conectividad',priority:'Alta',done:false}, {id:102,title:'Monitor de recepción sin imagen',category:'Hardware',priority:'Baja',done:false}, {id:103,title:'Restablecimiento de acceso solicitado',category:'Accesos',priority:'Media',done:true} ];
  let nextId = 104;
  const title = root.querySelector('#ticket-title'), description = root.querySelector('#ticket-description');
  const analyze = () => {
    const result = classifyTicket(`${title.value} ${description.value}`);
    const box = root.querySelector('#ticket-analysis'); box.replaceChildren(node('h3', '✦ Análisis simulado'), badge(result.category), badge(`Prioridad ${result.priority}`, result.priority === 'Alta' ? 'warn' : ''), node('p', result.reason));
    const list = node('ul'); result.steps.forEach(text => list.append(node('li', text))); box.append(list);
    return result;
  };
  const update = () => {
    root.querySelector('#hd-stats').replaceChildren(stat('Tickets de ejemplo', tickets.length), stat('Pendientes de resolución', tickets.filter(t => !t.done).length, true), stat('Resueltos', tickets.filter(t => t.done).length));
    const list = root.querySelector('#ticket-list'); list.replaceChildren();
    const filter = root.querySelector('#hd-filter').value;
    const visible = tickets.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
    visible.forEach(ticket => {
      const item = node('article', undefined, 'ticket-row'), copy = node('div');
      copy.append(node('p', `#${ticket.id} · ${ticket.category}`), node('h3', ticket.title), badge(ticket.done ? 'Resuelto' : `Prioridad ${ticket.priority}`, ticket.done ? 'done' : ticket.priority === 'Alta' ? 'warn' : ''));
      item.append(copy, button(ticket.done ? 'Reabrir' : 'Resolver ✓', () => { ticket.done = !ticket.done; update(); toast(`Ticket #${ticket.id} ${ticket.done ? 'resuelto' : 'reabierto'}.`); })); list.append(item);
    });
    if (!visible.length) list.append(empty('No hay tickets en este estado.'));
  };
  const scenarios = [ ['Acceso', 'No puedo acceder al CRM', 'Mi cuenta no puede iniciar sesión y aparece un error de acceso.'], ['Red', 'VPN caída en toda la empresa', 'Todos los equipos perdieron conexión a la VPN y a internet.'], ['Seguridad', 'Correo sospechoso', 'Recibí un correo de phishing con un enlace que solicita mi contraseña.'] ];
  scenarios.forEach(([label, heading, text]) => root.querySelector('#scenarios').append(button(label, () => { title.value = heading; description.value = text; analyze(); })));
  root.querySelector('#analyze-ticket').addEventListener('click', analyze);
  root.querySelector('#hd-filter').addEventListener('change', update);
  root.querySelector('#ticket-form').addEventListener('submit', event => { event.preventDefault(); if (tickets.length >= 30) { toast('Se alcanzó el límite de la demo. Reiníciala para continuar.'); return; } const heading = title.value.trim().slice(0,100); if (!heading || !description.value.trim()) return; const result = analyze(); tickets.unshift({id:nextId++,title:heading,category:result.category,priority:result.priority,done:false}); update(); toast('Ticket ficticio creado. Puedes resolverlo desde la bandeja.'); });
  analyze(); update();
}

function passforge() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">PASSWORDS / CONTROL</p><h2>Tu próxima clave.<br>En tus manos.</h2><p class="muted">Aleatoriedad criptográfica y organización temporal, con un flujo directo.</p></div><span class="badge done">Web Crypto / local</span></div><div class="split"><section class="panel"><div class="panel-title"><h3>Generador</h3><span>✳</span></div><div id="generated-password" class="secret-display" aria-live="polite"></div><div class="row spread"><label for="password-length">Longitud <strong id="length-value">20</strong></label><button id="toggle-password" class="quiet">Mostrar clave</button></div><input id="password-length" type="range" min="8" max="64" value="20"><div class="generator-options"><label><input type="checkbox" data-set="lower" checked>Minúsculas</label><label><input type="checkbox" data-set="upper" checked>Mayúsculas</label><label><input type="checkbox" data-set="numbers" checked>Números</label><label><input type="checkbox" data-set="symbols" checked>Símbolos</label></div><div class="meter" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p class="muted small">Muestreo sin sesgo · Incluye cada grupo seleccionado</p><div class="form-actions"><button class="primary" id="generate-password">Generar otra clave ↻</button><button id="copy-password" type="button">Copiar clave</button></div><p id="copy-result" class="muted small" role="status"></p></section><section class="panel"><div class="panel-title"><h3>Bóveda de ejemplo</h3><small>SOLO MEMORIA</small></div><div id="vault-list"></div><form id="vault-form"><label for="entry-name">Nombre ficticio del registro</label><input id="entry-name" maxlength="60" value="Proyecto de prueba" required><label for="entry-category">Categoría</label><select id="entry-category"><option>Desarrollo</option><option>Personal</option><option>Trabajo</option></select><div class="form-actions"><button type="submit">Añadir clave generada +</button></div></form><p class="muted small mt-20">No introduzcas credenciales reales. Al recargar o reiniciar se borra esta bóveda.</p></section></div>`;
  let password = '', revealed = false, entries = [{id:1,name:'Cuenta de ejemplo',category:'Desarrollo',password:'DEMO-ONLY-42!'}], nextId = 2;
  const display = () => { root.querySelector('#generated-password').textContent = revealed ? password : '•'.repeat(password.length); root.querySelector('#toggle-password').textContent = revealed ? 'Ocultar clave' : 'Mostrar clave'; };
  const generate = () => { try { password = generatePassword(Number(root.querySelector('#password-length').value), [...root.querySelectorAll('[data-set]:checked')].map(item => item.dataset.set)); display(); toast('Nueva clave generada localmente.'); } catch (error) { toast(error.message); } };
  const update = () => {
    const list = root.querySelector('#vault-list'); list.replaceChildren();
    entries.forEach(entry => { const item = node('article', undefined, 'vault-entry'), row = node('div', undefined, 'row spread'); row.append(node('h3', entry.name), button('Quitar', () => { entries = entries.filter(e => e.id !== entry.id); update(); toast('Registro eliminado de la sesión.'); })); item.append(row, badge(entry.category), node('code', '••••••••••••')); list.append(item); });
    if (!entries.length) list.append(empty('Añade una clave de ejemplo para explorar la bóveda.'));
  };
  root.querySelector('#toggle-password').addEventListener('click', () => { revealed = !revealed; display(); });
  root.querySelector('#generate-password').addEventListener('click', generate);
  root.querySelector('#copy-password').addEventListener('click', async () => { try { await navigator.clipboard.writeText(password); root.querySelector('#copy-result').textContent = 'Clave generada copiada. No se guarda en la aplicación.'; } catch { root.querySelector('#copy-result').textContent = 'No se pudo copiar. Usa Mostrar clave para seleccionarla.'; } });
  root.querySelector('#password-length').addEventListener('input', event => { root.querySelector('#length-value').textContent = event.target.value; });
  root.querySelector('#vault-form').addEventListener('submit', event => { event.preventDefault(); const name = root.querySelector('#entry-name').value.trim().slice(0,60); if (!name || !password) return; if (entries.length >= 15) { toast('Límite de 15 registros en esta demo.'); return; } entries.unshift({id:nextId++,name,category:root.querySelector('#entry-category').value,password}); update(); toast('Registro añadido solo a la memoria de esta sesión.'); });
  generate(); update();
}

function gamerhub() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">PLAY / CONNECT / DISCOVER</p><h2>Tu próximo juego.<br>Tu próxima comunidad.</h2><p class="muted">Explora un catálogo curado de ejemplo y arma tu lista para la próxima partida.</p></div><button id="only-favorites" aria-pressed="false">Solo favoritos ☆</button></div><div class="game-filters"><label class="sr-only" for="game-search">Buscar juegos</label><input id="game-search" type="search" placeholder="Buscar un juego…" maxlength="80"><label class="sr-only" for="game-genre">Género</label><select id="game-genre"><option>Todos los géneros</option><option>Aventura</option><option>Estrategia</option><option>Cooperativo</option></select></div><p id="game-count" class="muted small" aria-live="polite"></p><div id="game-list" class="game-grid mt-16"></div><div class="panel-title mt-35"><h3>Tu próximo equipo</h3><small>PERFILES FICTICIOS</small></div><div id="player-list" class="player-list"></div>`;
  const games = [{id:1,name:'Astral Odyssey',genre:'Aventura',tag:'EXPLORA LO DESCONOCIDO',desc:'Un viaje espacial para quienes buscan nuevas historias.'},{id:2,name:'Neon District',genre:'Cooperativo',tag:'JUNTOS EN LA CIUDAD',desc:'Misiones cooperativas en una ciudad de luces y circuitos.'},{id:3,name:'Iron Kingdoms',genre:'Estrategia',tag:'CADA DECISIÓN CUENTA',desc:'Construye un reino y decide cómo protegerlo.'},{id:4,name:'Wild Horizon',genre:'Aventura',tag:'SIN MAPAS. SIN LÍMITES.',desc:'Descubre paisajes y secretos fuera de los caminos.'},{id:5,name:'Circuit Rivals',genre:'Cooperativo',tag:'ENCUENTRA TU EQUIPO',desc:'Carreras en equipo con precisión y coordinación.'},{id:6,name:'Tiny Empires',genre:'Estrategia',tag:'PEQUEÑO MUNDO. GRAN PLAN.',desc:'Una estrategia tranquila de recursos y expansión.'}];
  const favorites = new Set(); let onlyFavorites = false;
  const detail = document.createElement('dialog'); detail.className = 'game-detail'; root.append(detail);
  detail.setAttribute('aria-labelledby','game-detail-title'); let detailTrigger;
  function openGame(game) {
    detailTrigger = document.activeElement;
    detail.replaceChildren();
    const close = button('Cerrar ✕', () => detail.close(), 'quiet');
    const heading = node('h2',game.name); heading.id = 'game-detail-title';
    detail.append(close, node('p','CATÁLOGO FICTICIO / DEMO','overline'), heading, badge(game.genre), node('p',game.desc), node('p','Explora el catálogo y guarda este juego de ejemplo. No se abre una compra ni un chat real.','muted'));
    detail.showModal();
  }
  detail.addEventListener('close', () => detailTrigger?.focus());
  const update = () => {
    const query = root.querySelector('#game-search').value.toLowerCase(), genre = root.querySelector('#game-genre').value;
    const visible = games.filter(game => game.name.toLowerCase().includes(query) && (genre === 'Todos los géneros' || game.genre === genre) && (!onlyFavorites || favorites.has(game.id)));
    root.querySelector('#game-count').textContent = `${visible.length} juegos visibles · ${favorites.size} en tu lista`;
    const list = root.querySelector('#game-list'); list.replaceChildren();
    visible.forEach(game => { const item = node('article',undefined,'game-card'), cover = node('div',undefined,'game-cover'), info = node('div',undefined,'game-info'), row = node('div',undefined,'row'); cover.append(node('span',game.tag),node('strong',game.name)); row.append(badge(game.genre),button(favorites.has(game.id) ? 'Guardado ★' : 'Guardar ☆', () => { favorites.has(game.id) ? favorites.delete(game.id) : favorites.add(game.id); update(); toast(`${game.name}: ${favorites.has(game.id) ? 'añadido a' : 'quitado de'} tu lista.`); })); row.append(button('Ver detalle ↗', () => openGame(game))); info.append(node('p',game.desc),row); item.append(cover,info); list.append(item); });
    if (!visible.length) list.append(empty('No hay coincidencias. Prueba otro filtro o añade favoritos.'));
  };
  [['AV','Astro Vega','Aventura · PC'],['NL','Nova Lane','Cooperativo · Multiplataforma'],['KS','Kai Stone','Estrategia · PC']].forEach(([initials,name,info]) => { const item = node('article',undefined,'player'), text = node('div'); text.append(node('h3',name),node('p',info)); item.append(node('span',initials,'avatar'),text); root.querySelector('#player-list').append(item); });
  root.querySelector('#game-search').addEventListener('input',update); root.querySelector('#game-genre').addEventListener('change',update);
  root.querySelector('#only-favorites').addEventListener('click', event => { onlyFavorites = !onlyFavorites; event.currentTarget.setAttribute('aria-pressed',String(onlyFavorites)); event.currentTarget.textContent = onlyFavorites ? 'Ver catálogo completo' : 'Solo favoritos ☆'; update(); }); update();
}

function taskapi() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">WORKFLOW / RESPONSIBILITIES</p><h2>El trabajo, claro.<br>El equipo, conectado.</h2><p class="muted">Crea, asigna y cambia estados. Explora cómo cambia la vista según el rol.</p></div><span class="badge">API simulada / sin servidor</span></div><section class="panel"><div class="row spread"><h3>Vista de demostración</h3><div class="row"><label for="task-role">Rol</label><select id="task-role" class="width-auto"><option value="admin">Administrador</option><option value="employee">Empleado</option></select><label for="task-person">Integrante</label><select id="task-person" class="width-auto"><option>Alex</option><option>Sam</option></select></div></div><form id="task-form"><div class="row"><div class="flex-input"><label for="task-title">Nueva tarea ficticia</label><input id="task-title" maxlength="100" placeholder="Preparar demo para revisión" required></div><div><label for="task-owner">Asignar a</label><select id="task-owner"><option>Alex</option><option>Sam</option></select></div><button class="primary align-end" type="submit">Crear tarea +</button></div></form></section><div class="stats" id="task-stats"></div><div id="kanban" class="kanban"></div><pre id="api-log" class="endpoint-log" aria-live="polite"></pre>`;
  const tasks = [{id:1,title:'Diseñar pantalla de onboarding',owner:'Alex',status:'En curso'},{id:2,title:'Documentar endpoints',owner:'Sam',status:'Pendiente'},{id:3,title:'Revisar estados vacíos',owner:'Alex',status:'Pendiente'},{id:4,title:'Preparar datos ficticios',owner:'Sam',status:'Completada'}]; let nextId = 5;
  const role = () => root.querySelector('#task-role').value, person = () => root.querySelector('#task-person').value;
  const log = (method,path,code,payload) => { root.querySelector('#api-log').textContent = `SIMULACIÓN LOCAL · sin petición de red\n${method} ${path} → ${code}\n${JSON.stringify(payload,null,2)}`; };
  const update = () => {
    const visible = visibleTasks(tasks,role(),person()); root.querySelector('#task-form').hidden = role() !== 'admin';
    root.querySelector('#task-stats').replaceChildren(stat('Tareas visibles',visible.length),stat('En curso',visible.filter(t=>t.status==='En curso').length,true),stat('Completadas',visible.filter(t=>t.status==='Completada').length));
    const board = root.querySelector('#kanban'); board.replaceChildren();
    ['Pendiente','En curso','Completada'].forEach(status => { const column = node('section',undefined,'kanban-column'); column.append(node('h3',status.toUpperCase())); const matches = visible.filter(t=>t.status===status); matches.forEach(task=>{const card=node('article',undefined,'task-card'), select=node('select'); select.setAttribute('aria-label',`Estado de ${task.title}`); ['Pendiente','En curso','Completada'].forEach(value=>{const option=node('option',value); option.value=value; select.append(option);}); select.value=task.status; select.addEventListener('change',event=>{const result=changeTask(tasks,task.id,event.target.value,role(),person());log('PATCH',`/users/${task.owner}/tasks/${task.id}`,result.code,result.task||{error:'Acceso denegado en la simulación'});update();toast('Estado actualizado en esta sesión.');});card.append(node('h3',task.title),node('p',`#${task.id} · ${task.owner}`),select); if(role()==='admin') card.append(button('Eliminar tarea',()=>{ const index=tasks.findIndex(item=>item.id===task.id); if(index<0)return; tasks.splice(index,1); log('DELETE',`/admin/tasks/${task.id}`,204,{deleted:task.id}); update(); toast('Tarea eliminada de esta demo. Reiniciar restaura los ejemplos.'); },'quiet'));column.append(card);}); if(!matches.length)column.append(empty('Sin tareas'));board.append(column);});
  };
  root.querySelector('#task-form').addEventListener('submit',event=>{event.preventDefault();if(role()!=='admin'){log('POST','/admin/tasks',403,{error:'Rol no permitido en la simulación'});return;}const title=root.querySelector('#task-title').value.trim().slice(0,100);if(!title)return;if(tasks.length>=30){toast('Límite de 30 tareas en esta demo.');return;}const task={id:nextId++,title,owner:root.querySelector('#task-owner').value,status:'Pendiente'};tasks.push(task);log('POST','/admin/tasks',201,task);root.querySelector('#task-title').value='';update();toast('Tarea ficticia creada y asignada.');});
  const changeView=()=>{update();log('GET',role()==='admin'?'/admin/tasks':`/users/${person()}/tasks`,200,{visible:visibleTasks(tasks,role(),person()).length,view:role()});};root.querySelector('#task-role').addEventListener('change',changeView);root.querySelector('#task-person').addEventListener('change',changeView);changeView();
}

function render() { root.replaceChildren(); ({helpdesk,passforge,gamerhub,taskapi})[key](); }
render();

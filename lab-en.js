import { generatePassword, characterSets, classifyTicket, visibleTasks, changeTask } from './lab-core-en.js';

const configs = {
  helpdesk: { name: 'HelpDesk IA', intro: 'From incident to an organized response.', repo: 'helpdesk-ia', boundary: 'Local demo with deterministic rules. AI analysis is simulated; tickets are not submitted and Gemini is not called.', guide: ['Choose a sample incident or write a fictional one.', 'Analyze the classification and review the suggested steps.', 'Create the ticket and resolve it from the inbox.'], limits: 'This edition shows the support workflow. It does not run the original Express backend, Prisma or AI model.' },
  passforge: { name: 'PassForge', intro: 'Generate. Organize. Stay in control.', repo: 'passforge-nextjs-prisma', boundary: 'Local generator using Web Crypto. Fictional in-memory vault: no account, persistence, vault encryption or synchronization. Do not use it to manage real credentials.', guide: ['Adjust the length and character groups.', 'Generate a password and try showing or hiding it.', 'Add a sample entry to the temporary vault and try resetting it.'], limits: 'Generation is real and uses cryptographic randomness. The vault is a temporary demonstration and does not reproduce authentication or storage from the Next.js project.' },
  gamerhub: { name: 'GamerHub', intro: 'Find your next game.', repo: 'gamerhub-frontend', boundary: 'Fictional catalog and players. Temporary favorites in your browser; no login, API, chat or MongoDB connection.', guide: ['Search for a game or filter by genre.', 'Save games to your list and open Favorites only.', 'Explore fictional profiles and reset to restore the catalog.'], limits: 'A separate edition for exploring a catalog and favorites. It does not use RAWG or the original backend and does not create real accounts or connections.' },
  taskapi: { name: 'Task API', intro: 'One workflow, different responsibilities.', repo: 'task-rest-api', boundary: 'Local simulation of tasks and role-based views. The endpoints and permissions shown are examples; this demo has no real authentication.', guide: ['Create a task for a team member in the Administrator view.', 'Switch to the Employee view and select that team member.', 'Update the status and inspect the simulated HTTP response.'], limits: 'Data is fictional. Role selection demonstrates the interface; real authorization must run in the Laravel backend, which is not executed here.' }
};
const requested = new URLSearchParams(location.search).get('project') || document.body.dataset.app || 'helpdesk';
const key = Object.hasOwn(configs, requested) ? requested : 'helpdesk';
const config = configs[key];
document.title = `${config.name} · Interactive demo · Lucas Nieto`;
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
document.querySelector('#guide-title').textContent = `Try ${config.name}`;
document.querySelector('#guide-button').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-guide').addEventListener('click', () => dialog.close());
document.querySelector('#reset-button').addEventListener('click', () => { render(); toast('Demo reset. Changes from this session were cleared.'); });

function stat(label, value, accented = false) { const item = node('div', undefined, `stat${accented ? ' accent' : ''}`); item.append(node('strong', String(value)), node('span', label)); return item; }

function helpdesk() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">SUPPORT / INTELLIGENCE</p><h2>Less noise.<br>More resolution.</h2><p class="muted">A complete workflow: describe, classify, prioritize and resolve.</p></div><span class="badge done">Demonstration classifier</span></div><div class="stats" id="hd-stats"></div><div class="split"><section class="panel"><div class="panel-title"><h3>Ticket inbox</h3><small>WORKSPACE / DEMO</small></div><label for="hd-filter">Status</label><select id="hd-filter"><option value="all">All tickets</option><option value="open">Open</option><option value="done">Resolved</option></select><div id="ticket-list" class="ticket-list mt-15"></div></section><section class="panel"><div class="panel-title"><h3>New incident</h3><span>✦</span></div><p class="muted small">Try a scenario:</p><div class="scenario-buttons" id="scenarios"></div><form id="ticket-form"><label for="ticket-title">Title</label><input id="ticket-title" maxlength="100" required value="I cannot access the CRM"><label for="ticket-description">Fictional description</label><textarea id="ticket-description" maxlength="1000" required>I cannot log into the CRM. My account shows an access error.</textarea><div class="form-actions"><button type="button" id="analyze-ticket">Analyze example ✦</button><button class="primary" type="submit">Create ticket ↗</button></div></form><div id="ticket-analysis" class="analysis-box" aria-live="polite"></div></section></div>`;
  const tickets = [ {id:101,title:'Team VPN is offline',category:'Connectivity',priority:'High',done:false}, {id:102,title:'Reception monitor has no image',category:'Hardware',priority:'Low',done:false}, {id:103,title:'Access reset requested',category:'Access',priority:'Medium',done:true} ];
  let nextId = 104;
  const title = root.querySelector('#ticket-title'), description = root.querySelector('#ticket-description');
  const analyze = () => {
    const result = classifyTicket(`${title.value} ${description.value}`);
    const box = root.querySelector('#ticket-analysis'); box.replaceChildren(node('h3', '✦ Simulated analysis'), badge(result.category), badge(`Priority ${result.priority}`, result.priority === 'High' ? 'warn' : ''), node('p', result.reason));
    const list = node('ul'); result.steps.forEach(text => list.append(node('li', text))); box.append(list);
    return result;
  };
  const update = () => {
    root.querySelector('#hd-stats').replaceChildren(stat('Sample tickets', tickets.length), stat('Awaiting resolution', tickets.filter(t => !t.done).length, true), stat('Resolved', tickets.filter(t => t.done).length));
    const list = root.querySelector('#ticket-list'); list.replaceChildren();
    const filter = root.querySelector('#hd-filter').value;
    const visible = tickets.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
    visible.forEach(ticket => {
      const item = node('article', undefined, 'ticket-row'), copy = node('div');
      copy.append(node('p', `#${ticket.id} · ${ticket.category}`), node('h3', ticket.title), badge(ticket.done ? 'Resolved' : `Priority ${ticket.priority}`, ticket.done ? 'done' : ticket.priority === 'High' ? 'warn' : ''));
      item.append(copy, button(ticket.done ? 'Reopen' : 'Resolve ✓', () => { ticket.done = !ticket.done; update(); toast(`Ticket #${ticket.id} ${ticket.done ? 'resolved' : 'reopened'}.`); })); list.append(item);
    });
    if (!visible.length) list.append(empty('No tickets with this status.'));
  };
  const scenarios = [ ['Access', 'I cannot access the CRM', 'My account cannot log in and shows an access error.'], ['Network', 'Company-wide VPN outage', 'All company devices lost VPN and internet connectivity.'], ['Security', 'Suspicious email', 'I received a phishing email with a link requesting my password.'] ];
  scenarios.forEach(([label, heading, text]) => root.querySelector('#scenarios').append(button(label, () => { title.value = heading; description.value = text; analyze(); })));
  root.querySelector('#analyze-ticket').addEventListener('click', analyze);
  root.querySelector('#hd-filter').addEventListener('change', update);
  root.querySelector('#ticket-form').addEventListener('submit', event => { event.preventDefault(); if (tickets.length >= 30) { toast('Demo limit reached. Reset it to continue.'); return; } const heading = title.value.trim().slice(0,100); if (!heading || !description.value.trim()) return; const result = analyze(); tickets.unshift({id:nextId++,title:heading,category:result.category,priority:result.priority,done:false}); update(); toast('Fictional ticket created. You can resolve it from the inbox.'); });
  analyze(); update();
}

function passforge() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">PASSWORDS / CONTROL</p><h2>Your next password.<br>In your hands.</h2><p class="muted">Cryptographic randomness and temporary organization in a straightforward workflow.</p></div><span class="badge done">Web Crypto / local</span></div><div class="split"><section class="panel"><div class="panel-title"><h3>Generator</h3><span>✳</span></div><div id="generated-password" class="secret-display" aria-live="polite"></div><div class="row spread"><label for="password-length">Length <strong id="length-value">20</strong></label><button id="toggle-password" class="quiet">Show password</button></div><input id="password-length" type="range" min="8" max="64" value="20"><div class="generator-options"><label><input type="checkbox" data-set="lower" checked>Lowercase</label><label><input type="checkbox" data-set="upper" checked>Uppercase</label><label><input type="checkbox" data-set="numbers" checked>Numbers</label><label><input type="checkbox" data-set="symbols" checked>Symbols</label></div><div class="meter" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p class="muted small">Unbiased sampling · Includes every selected group</p><div class="form-actions"><button class="primary" id="generate-password">Generate another password ↻</button></div></section><section class="panel"><div class="panel-title"><h3>Sample vault</h3><small>MEMORY ONLY</small></div><div id="vault-list"></div><form id="vault-form"><label for="entry-name">Fictional entry name</label><input id="entry-name" maxlength="60" value="Test project" required><label for="entry-category">Category</label><select id="entry-category"><option>Development</option><option>Personal</option><option>Work</option></select><div class="form-actions"><button type="submit">Add generated password +</button></div></form><p class="muted small mt-20">Do not enter real credentials. Reloading or resetting clears this vault.</p></section></div>`;
  let password = '', revealed = false, entries = [{id:1,name:'Sample account',category:'Development',password:'DEMO-ONLY-42!'}], nextId = 2;
  const display = () => { root.querySelector('#generated-password').textContent = revealed ? password : '•'.repeat(password.length); root.querySelector('#toggle-password').textContent = revealed ? 'Hide password' : 'Show password'; };
  const generate = () => { try { password = generatePassword(Number(root.querySelector('#password-length').value), [...root.querySelectorAll('[data-set]:checked')].map(item => item.dataset.set)); display(); toast('New password generated locally.'); } catch (error) { toast(error.message); } };
  const update = () => {
    const list = root.querySelector('#vault-list'); list.replaceChildren();
    entries.forEach(entry => { const item = node('article', undefined, 'vault-entry'), row = node('div', undefined, 'row spread'); row.append(node('h3', entry.name), button('Remove', () => { entries = entries.filter(e => e.id !== entry.id); update(); toast('Entry removed from the session.'); })); item.append(row, badge(entry.category), node('code', '••••••••••••')); list.append(item); });
    if (!entries.length) list.append(empty('Add a sample password to explore the vault.'));
  };
  root.querySelector('#toggle-password').addEventListener('click', () => { revealed = !revealed; display(); });
  root.querySelector('#generate-password').addEventListener('click', generate);
  root.querySelector('#password-length').addEventListener('input', event => { root.querySelector('#length-value').textContent = event.target.value; });
  root.querySelector('#vault-form').addEventListener('submit', event => { event.preventDefault(); const name = root.querySelector('#entry-name').value.trim().slice(0,60); if (!name || !password) return; if (entries.length >= 15) { toast('This demo allows up to 15 entries.'); return; } entries.unshift({id:nextId++,name,category:root.querySelector('#entry-category').value,password}); update(); toast('Entry added only to the memory of this session.'); });
  generate(); update();
}

function gamerhub() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">PLAY / CONNECT / DISCOVER</p><h2>Your next game.<br>Your next community.</h2><p class="muted">Explore a curated sample catalog and build your list for the next game.</p></div><button id="only-favorites" aria-pressed="false">Favorites only ☆</button></div><div class="game-filters"><label class="sr-only" for="game-search">Search games</label><input id="game-search" type="search" placeholder="Search for a game…" maxlength="80"><label class="sr-only" for="game-genre">Genre</label><select id="game-genre"><option>All genres</option><option>Adventure</option><option>Strategy</option><option>Cooperative</option></select></div><p id="game-count" class="muted small" aria-live="polite"></p><div id="game-list" class="game-grid mt-16"></div><div class="panel-title mt-35"><h3>Your next team</h3><small>FICTIONAL PROFILES</small></div><div id="player-list" class="player-list"></div>`;
  const games = [{id:1,name:'Astral Odyssey',genre:'Adventure',tag:'EXPLORE THE UNKNOWN',desc:'A space journey for those seeking new stories.'},{id:2,name:'Neon District',genre:'Cooperative',tag:'TOGETHER IN THE CITY',desc:'Cooperative missions in a city of lights and circuits.'},{id:3,name:'Iron Kingdoms',genre:'Strategy',tag:'EVERY DECISION COUNTS',desc:'Build a kingdom and decide how to protect it.'},{id:4,name:'Wild Horizon',genre:'Adventure',tag:'NO MAPS. NO LIMITS.',desc:'Discover landscapes and secrets off the beaten path.'},{id:5,name:'Circuit Rivals',genre:'Cooperative',tag:'FIND YOUR TEAM',desc:'Team racing with precision and coordination.'},{id:6,name:'Tiny Empires',genre:'Strategy',tag:'SMALL WORLD. BIG PLAN.',desc:'A relaxed strategy experience about resources and expansion.'}];
  const favorites = new Set(); let onlyFavorites = false;
  const update = () => {
    const query = root.querySelector('#game-search').value.toLowerCase(), genre = root.querySelector('#game-genre').value;
    const visible = games.filter(game => game.name.toLowerCase().includes(query) && (genre === 'All genres' || game.genre === genre) && (!onlyFavorites || favorites.has(game.id)));
    root.querySelector('#game-count').textContent = `${visible.length} games visible · ${favorites.size} in your list`;
    const list = root.querySelector('#game-list'); list.replaceChildren();
    visible.forEach(game => { const item = node('article',undefined,'game-card'), cover = node('div',undefined,'game-cover'), info = node('div',undefined,'game-info'), row = node('div',undefined,'row'); cover.append(node('span',game.tag),node('strong',game.name)); row.append(badge(game.genre),button(favorites.has(game.id) ? 'Saved ★' : 'Save ☆', () => { favorites.has(game.id) ? favorites.delete(game.id) : favorites.add(game.id); update(); toast(`${game.name}: ${favorites.has(game.id) ? 'added to' : 'removed from'} your list.`); })); info.append(node('p',game.desc),row); item.append(cover,info); list.append(item); });
    if (!visible.length) list.append(empty('No matches. Try a different filter or add favorites.'));
  };
  [['AV','Astro Vega','Adventure · PC'],['NL','Nova Lane','Cooperative · Cross-platform'],['KS','Kai Stone','Strategy · PC']].forEach(([initials,name,info]) => { const item = node('article',undefined,'player'), text = node('div'); text.append(node('h3',name),node('p',info)); item.append(node('span',initials,'avatar'),text); root.querySelector('#player-list').append(item); });
  root.querySelector('#game-search').addEventListener('input',update); root.querySelector('#game-genre').addEventListener('change',update);
  root.querySelector('#only-favorites').addEventListener('click', event => { onlyFavorites = !onlyFavorites; event.currentTarget.setAttribute('aria-pressed',String(onlyFavorites)); event.currentTarget.textContent = onlyFavorites ? 'View full catalog' : 'Favorites only ☆'; update(); }); update();
}

function taskapi() {
  root.innerHTML = `<div class="app-heading"><div><p class="overline">WORKFLOW / RESPONSIBILITIES</p><h2>Clear work.<br>A connected team.</h2><p class="muted">Create, assign and change status. Explore how the view changes with each role.</p></div><span class="badge">Simulated API / no server</span></div><section class="panel"><div class="row spread"><h3>Demo view</h3><div class="row"><label for="task-role">Role</label><select id="task-role" class="width-auto"><option value="admin">Administrator</option><option value="employee">Employee</option></select><label for="task-person">Team member</label><select id="task-person" class="width-auto"><option>Alex</option><option>Sam</option></select></div></div><form id="task-form"><div class="row"><div class="flex-input"><label for="task-title">New fictional task</label><input id="task-title" maxlength="100" placeholder="Prepare demo for review" required></div><div><label for="task-owner">Assign to</label><select id="task-owner"><option>Alex</option><option>Sam</option></select></div><button class="primary align-end" type="submit">Create task +</button></div></form></section><div class="stats" id="task-stats"></div><div id="kanban" class="kanban"></div><pre id="api-log" class="endpoint-log" aria-live="polite"></pre>`;
  const tasks = [{id:1,title:'Design the onboarding screen',owner:'Alex',status:'In progress'},{id:2,title:'Document endpoints',owner:'Sam',status:'Pending'},{id:3,title:'Review empty states',owner:'Alex',status:'Pending'},{id:4,title:'Prepare fictional data',owner:'Sam',status:'Completed'}]; let nextId = 5;
  const role = () => root.querySelector('#task-role').value, person = () => root.querySelector('#task-person').value;
  const log = (method,path,code,payload) => { root.querySelector('#api-log').textContent = `LOCAL SIMULATION · no network request\n${method} ${path} → ${code}\n${JSON.stringify(payload,null,2)}`; };
  const update = () => {
    const visible = visibleTasks(tasks,role(),person()); root.querySelector('#task-form').hidden = role() !== 'admin';
    root.querySelector('#task-stats').replaceChildren(stat('Visible tasks',visible.length),stat('In progress',visible.filter(t=>t.status==='In progress').length,true),stat('Completed',visible.filter(t=>t.status==='Completed').length));
    const board = root.querySelector('#kanban'); board.replaceChildren();
    ['Pending','In progress','Completed'].forEach(status => { const column = node('section',undefined,'kanban-column'); column.append(node('h3',status.toUpperCase())); const matches = visible.filter(t=>t.status===status); matches.forEach(task=>{const card=node('article',undefined,'task-card'), select=node('select'); select.setAttribute('aria-label',`Status of ${task.title}`); ['Pending','In progress','Completed'].forEach(value=>{const option=node('option',value); option.value=value; select.append(option);}); select.value=task.status; select.addEventListener('change',event=>{const result=changeTask(tasks,task.id,event.target.value,role(),person());log('PATCH',`/users/${task.owner}/tasks/${task.id}`,result.code,result.task||{error:'Access denied in the simulation'});update();toast('Status updated in this session.');});card.append(node('h3',task.title),node('p',`#${task.id} · ${task.owner}`),select);column.append(card);}); if(!matches.length)column.append(empty('No tasks'));board.append(column);});
  };
  root.querySelector('#task-form').addEventListener('submit',event=>{event.preventDefault();if(role()!=='admin'){log('POST','/admin/tasks',403,{error:'Role not allowed in the simulation'});return;}const title=root.querySelector('#task-title').value.trim().slice(0,100);if(!title)return;if(tasks.length>=30){toast('This demo allows up to 30 tasks.');return;}const task={id:nextId++,title,owner:root.querySelector('#task-owner').value,status:'Pending'};tasks.push(task);log('POST','/admin/tasks',201,task);root.querySelector('#task-title').value='';update();toast('Fictional task created and assigned.');});
  const changeView=()=>{update();log('GET',role()==='admin'?'/admin/tasks':`/users/${person()}/tasks`,200,{visible:visibleTasks(tasks,role(),person()).length,view:role()});};root.querySelector('#task-role').addEventListener('change',changeView);root.querySelector('#task-person').addEventListener('change',changeView);changeView();
}

function render() { root.replaceChildren(); ({helpdesk,passforge,gamerhub,taskapi})[key](); }
render();

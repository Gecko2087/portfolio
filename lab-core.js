export const characterSets = {
  lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789', symbols: '!@#$%&*+-=?'
};

// Rejection sampling prevents modulo bias. Each enabled alphabet is represented.
export function generatePassword(length, enabled, cryptoProvider = globalThis.crypto) {
  const size = Number(length);
  const sets = Object.keys(characterSets).filter(key => enabled.includes(key)).map(key => characterSets[key]);
  if (!Number.isInteger(size) || size < 8 || size > 64 || !sets.length) throw new Error('Selecciona al menos un grupo y una longitud entre 8 y 64.');
  if (!cryptoProvider?.getRandomValues) throw new Error('Este navegador no dispone de un generador criptográfico.');
  const pick = max => {
    const limit = Math.floor(256 / max) * max;
    const byte = new Uint8Array(1);
    do { cryptoProvider.getRandomValues(byte); } while (byte[0] >= limit);
    return byte[0] % max;
  };
  const alphabet = sets.join('');
  const result = sets.map(set => set[pick(set.length)]);
  while (result.length < size) result.push(alphabet[pick(alphabet.length)]);
  for (let i = result.length - 1; i > 0; i--) { const j = pick(i + 1); [result[i], result[j]] = [result[j], result[i]]; }
  return result.join('');
}

export function classifyTicket(text) {
  const normalized = String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const rules = [
    { words: ['phishing', 'sospechoso', 'malware', 'virus'], category: 'Seguridad', priority: 'Alta', steps: ['No abrir enlaces ni adjuntos sospechosos.', 'Escalar el incidente al equipo de seguridad.'] },
    { words: ['acceso', 'contrasena', 'login', 'iniciar sesion', 'crm'], category: 'Accesos', priority: 'Media', steps: ['Comprobar el mensaje de error y el estado de la cuenta.', 'Solicitar revisión de permisos por un canal autorizado.'] },
    { words: ['internet', 'wifi', 'red', 'vpn'], category: 'Conectividad', priority: 'Media', steps: ['Comprobar si el problema afecta a otros equipos.', 'Registrar la conexión afectada y escalar a redes.'] },
    { words: ['pantalla', 'monitor', 'teclado', 'impresora'], category: 'Hardware', priority: 'Baja', steps: ['Revisar conexiones físicas y alimentación.', 'Solicitar asistencia técnica si el problema continúa.'] }
  ];
  const rule = rules.find(item => item.words.some(word => normalized.includes(word)));
  const critical = normalized.includes('todos') || normalized.includes('empresa') || normalized.includes('produccion');
  return rule ? { ...rule, priority: critical ? 'Alta' : rule.priority, reason: `Regla local: coincidencia con ${rule.category.toLowerCase()}${critical ? ' y afectación general' : ''}.` } : { category: 'General', priority: 'Media', steps: ['Pedir detalles sobre el impacto y los pasos previos.', 'Derivar al equipo correspondiente para revisión humana.'], reason: 'No hubo coincidencia específica. Se mantiene revisión humana.' };
}

export function visibleTasks(tasks, role, employee) {
  return role === 'admin' ? tasks : tasks.filter(task => task.owner === employee);
}

export function changeTask(tasks, id, status, role, employee) {
  const task = tasks.find(item => item.id === id);
  if (!task || !['Pendiente', 'En curso', 'Completada'].includes(status)) return { code: 404 };
  if (role !== 'admin' && task.owner !== employee) return { code: 403 };
  task.status = status;
  return { code: 200, task };
}

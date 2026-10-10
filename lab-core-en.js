export const characterSets = {
  lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789', symbols: '!@#$%&*+-=?'
};

// Rejection sampling prevents modulo bias. Each enabled alphabet is represented.
export function generatePassword(length, enabled, cryptoProvider = globalThis.crypto) {
  const size = Number(length);
  const sets = Object.keys(characterSets).filter(key => enabled.includes(key)).map(key => characterSets[key]);
  if (!Number.isInteger(size) || size < 8 || size > 64 || !sets.length) throw new Error('Select at least one group and a length between 8 and 64.');
  if (!cryptoProvider?.getRandomValues) throw new Error('This browser does not support cryptographic random generation.');
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
    { words: ['phishing', 'sospechoso', 'suspicious', 'malware', 'virus'], category: 'Security', priority: 'High', steps: ['Do not open suspicious links or attachments.', 'Escalate the incident to the security team.'] },
    { words: ['acceso', 'access', 'contrasena', 'password', 'login', 'iniciar sesion', 'sign in', 'crm'], category: 'Access', priority: 'Medium', steps: ['Check the error message and account status.', 'Request a permissions review through an authorized channel.'] },
    { words: ['internet', 'wifi', 'red', 'network', 'vpn'], category: 'Connectivity', priority: 'Medium', steps: ['Check whether the issue affects other devices.', 'Record the affected connection and escalate to networking.'] },
    { words: ['pantalla', 'screen', 'monitor', 'teclado', 'keyboard', 'impresora', 'printer'], category: 'Hardware', priority: 'Low', steps: ['Check physical connections and power.', 'Request technical assistance if the issue persists.'] }
  ];
  const rule = rules.find(item => item.words.some(word => normalized.includes(word)));
  const critical = (normalized.includes('todos') || normalized.includes('all company')) || (normalized.includes('empresa') || normalized.includes('company')) || (normalized.includes('produccion') || normalized.includes('production'));
  return rule ? { ...rule, priority: critical ? 'High' : rule.priority, reason: `Local rule: match for ${rule.category.toLowerCase()}${critical ? 'and widespread impact' : ''}.` } : { category: 'General', priority: 'Medium', steps: ['Ask for details about impact and previous steps.', 'Refer to the appropriate team for human review.'], reason: 'No specific match was found. Human review is retained.' };
}

export function visibleTasks(tasks, role, employee) {
  return role === 'admin' ? tasks : tasks.filter(task => task.owner === employee);
}

export function changeTask(tasks, id, status, role, employee) {
  const task = tasks.find(item => item.id === id);
  if (!task || !['Pending', 'In progress', 'Completed'].includes(status)) return { code: 404 };
  if (role !== 'admin' && task.owner !== employee) return { code: 403 };
  task.status = status;
  return { code: 200, task };
}

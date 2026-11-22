import { detect, LIMITS, parseBatch } from './quality-engine.js';

const en = document.documentElement.lang === 'en';
const labels = en ? {
  sample: 'Example batch', file: 'Imported batch', tickets: 'tickets', flags: 'flags', duplicates: 'duplicates ignored',
  flag: 'Flagged', clear: 'No flag', reviewed: 'Reviewed', customer: 'Customer', agent: 'Agent', system: 'System',
  match: 'The rule found a repeat-contact phrase in a customer message.',
  noMatch: 'The rule found no repeat-contact phrase.',
  confirm: 'Flag confirmed', dismiss: 'False positive', correct: 'Flag corrected',
  saved: 'Decision saved in this tab.', noReason: 'Enter a reason for your decision.',
  failed: 'Could not import this batch. Check the JSON structure and unique ticket and message IDs.',
  tooLarge: 'Choose a JSON file up to 1 MB.', storage: 'Browser storage is unavailable or full. Changes are visible until you reload.',
  sampleError: 'Could not load the example. Try again.',
  evidence: 'Message that triggered the rule',
} : {
  sample: 'Lote de ejemplo', file: 'Lote importado', tickets: 'tickets', flags: 'alertas', duplicates: 'duplicados ignorados',
  flag: 'Con alerta', clear: 'Sin alerta', reviewed: 'Revisado', customer: 'Cliente', agent: 'Agente', system: 'Sistema',
  match: 'La regla encontró una frase de contacto reiterado en un mensaje del cliente.',
  noMatch: 'La regla no encontró frases de contacto reiterado.',
  confirm: 'Alerta confirmada', dismiss: 'Falso positivo', correct: 'Alerta corregida',
  saved: 'Decisión guardada en esta pestaña.', noReason: 'Escribe un motivo para tu decisión.',
  failed: 'No se pudo importar el lote. Revisa la estructura del JSON y que los identificadores sean únicos.',
  tooLarge: 'Elige un archivo JSON de hasta 1 MB.', storage: 'El navegador no pudo guardar los cambios. Puedes verlos hasta que recargues.',
  sampleError: 'No se pudo cargar el ejemplo. Intenta de nuevo.',
  evidence: 'Mensaje que activó la regla',
};

const key = 'portfolio-quality-review-v2-' + (en ? 'en' : 'es');
const find = selector => document.querySelector(selector);
const queue = find('[data-queue]');
const messages = find('[data-messages]');
const form = find('[data-decision-form]');
const evidence = find('[data-evidence]');
const entries = find('[data-entries]');
const feedback = find('[data-feedback]');
const error = find('[data-error]');
const importError = find('[data-import-error]');
const retrySample = find('[data-retry-sample]');
const reason = find('#reason');
const fileInput = find('#quality-file');
let state = { raw: '', sample: false, selected: '', decisions: [] };
let batch;
let active;
let batchRequest = 0;

function addText(parent, tag, value) {
  const element = document.createElement(tag);
  element.textContent = value;
  parent.append(element);
  return element;
}

function showError(message, target = error) {
  target.textContent = message;
  target.hidden = !message;
}

function persist(message, status = feedback) {
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
    status.textContent = message;
  } catch {
    status.textContent = labels.storage;
  }
}

function renderQueue() {
  const flags = batch.tickets.filter(detect).length;
  find('[data-summary]').textContent = [
    state.sample ? labels.sample : labels.file,
    batch.tickets.length + ' ' + labels.tickets,
    flags + ' ' + labels.flags,
    batch.duplicates + ' ' + labels.duplicates,
  ].join(' · ');
  queue.replaceChildren();
  for (const ticket of batch.tickets) {
    const item = document.createElement('li');
    const reviewed = state.decisions.some(entry => entry.ticket === JSON.stringify(ticket));
    const status = reviewed ? labels.reviewed : detect(ticket) ? labels.flag : labels.clear;
    const button = addText(item, 'button', ticket.id + ' · ' + ticket.subject);
    button.type = 'button';
    button.className = 'action secondary qa-select';
    button.setAttribute('aria-pressed', String(ticket.id === state.selected));
    addText(button, 'small', status);
    button.addEventListener('click', () => {
      state.selected = ticket.id;
      renderTicket();
      persist('');
      if (window.matchMedia('(max-width: 720px)').matches) find('#ticket-heading').focus();
    });
    queue.append(item);
  }
}

function renderTicket() {
  const ticket = batch.tickets.find(item => item.id === state.selected) ?? batch.tickets[0];
  state.selected = ticket.id;
  const match = detect(ticket);
  active = { ticket: JSON.stringify(ticket), evidence: match?.id };
  find('#ticket-heading').textContent = ticket.subject;
  find('[data-rule]').textContent = match ? labels.match : labels.noMatch;
  evidence.hidden = !match;
  form.hidden = !match;
  form.reset();
  reason.setCustomValidity('');
  find('[data-decision-feedback]').textContent = '';
  messages.replaceChildren();
  for (const message of ticket.messages) {
    const row = document.createElement('li');
    row.tabIndex = -1;
    addText(row, 'strong', (labels[message.role] ?? message.role) + ' · ' + message.id);
    addText(row, 'p', message.text);
    messages.append(row);
    if (message.id === active.evidence) {
      row.dataset.flagged = '';
      const marker = addText(row, 'small', labels.evidence);
      marker.dataset.messageFlag = '';
      evidence.onclick = () => row.focus();
    }
  }
  renderHistory();
  for (const [index, button] of [...queue.querySelectorAll('button')].entries()) {
    button.setAttribute('aria-pressed', String(batch.tickets[index].id === state.selected));
  }
}

function renderHistory() {
  entries.replaceChildren();
  const decisions = state.decisions.filter(item => item.ticket === active.ticket);
  find('[data-history]').hidden = !decisions.length;
  for (const item of decisions.toReversed()) {
    const entry = document.createElement('li');
    addText(entry, 'strong', labels[item.decision] + ' · ' + item.evidence);
    addText(entry, 'p', item.reason);
    addText(entry, 'small', new Date(item.at).toLocaleString(en ? 'en' : 'es'));
    entries.append(entry);
  }
}

function load(raw, sample, message = '') {
  const next = parseBatch(raw);
  state = { ...state, raw, sample };
  batch = next;
  showError('');
  showError('', importError);
  retrySample.hidden = true;
  find('[data-workbench]').hidden = false;
  renderQueue();
  renderTicket();
  persist(message);
}

async function loadExample() {
  const request = ++batchRequest;
  try {
    const response = await fetch('/quality/sample-' + (en ? 'en' : 'es') + '.json');
    if (!response.ok) throw new Error();
    const raw = await response.text();
    if (request === batchRequest) load(raw, true, labels.sample);
  } catch {
    if (request === batchRequest) {
      showError(labels.sampleError, batch ? importError : error);
      retrySample.hidden = Boolean(batch);
    }
  }
}

find('[data-sample]').addEventListener('click', loadExample);
retrySample.addEventListener('click', loadExample);
fileInput.addEventListener('change', async () => {
  const [file] = fileInput.files;
  if (!file) return;
  fileInput.value = '';
  const request = ++batchRequest;
  if (file.size > LIMITS.bytes) {
    showError(labels.tooLarge, importError);
    return;
  }
  try {
    const raw = await file.text();
    if (request === batchRequest) load(raw, false, labels.file);
  } catch {
    if (request === batchRequest) showError(labels.failed, importError);
  }
});

reason.addEventListener('input', () => reason.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const decision = data.get('decision');
  const justification = reason.value.trim();
  if (!justification) {
    reason.setCustomValidity(labels.noReason);
    reason.reportValidity();
    return;
  }
  if (!active.evidence || !['confirm', 'dismiss', 'correct'].includes(decision)) return;
  state.decisions.push({ ...active, decision, reason: justification, at: Date.now() });
  form.reset();
  renderHistory();
  renderQueue();
  persist(labels.saved, find('[data-decision-feedback]'));
});

try {
  const stored = JSON.parse(sessionStorage.getItem(key) ?? 'null');
  if (stored) {
    parseBatch(stored.raw);
    state = stored;
    load(state.raw, state.sample);
  }
} catch {}
if (!batch) loadExample();

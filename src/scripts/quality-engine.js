// Small, deterministic rule engine for fictional support conversations.
// Errors expose stable codes so the interface can translate every failure.
export const LIMITS = Object.freeze({
  bytes: 1_000_000,
  tickets: 100,
  messages: 100,
  id: 80,
  subject: 300,
  text: 10_000,
});

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const string = (value, limit) => typeof value === 'string' && value.trim().length > 0 && value.length <= limit;
const roles = new Set(['customer', 'agent', 'system']);

/**
 * Parse {tickets:[{id,subject,messages:[{id,role,text}]}]}.
 * Identical repeated message IDs (within a ticket) and identical repeated ticket
 * IDs are discarded. Reusing an ID with different content rejects the batch.
 * `duplicates` counts each discarded record, including messages in repeated tickets.
 * Values and conversation order are preserved; unrecognized fields are ignored.
 */
export function parseBatch(raw) {
  if (typeof raw !== 'string') fail('INVALID_JSON');
  if (new TextEncoder().encode(raw).byteLength > LIMITS.bytes) fail('BATCH_TOO_LARGE');
  let batch;
  try { batch = JSON.parse(raw); } catch { fail('INVALID_JSON'); }
  if (!record(batch) || !Array.isArray(batch.tickets) || batch.tickets.length === 0) fail('INVALID_BATCH');
  if (batch.tickets.length > LIMITS.tickets) fail('TOO_MANY_TICKETS');

  const byId = new Map();
  let duplicates = 0;
  for (const input of batch.tickets) {
    if (!record(input) || !string(input.id, LIMITS.id) || !string(input.subject, LIMITS.subject)
      || !Array.isArray(input.messages) || input.messages.length === 0) fail('INVALID_TICKET');
    if (input.messages.length > LIMITS.messages) fail('TOO_MANY_MESSAGES');
    const messages = new Map();
    for (const item of input.messages) {
      if (!record(item) || !string(item.id, LIMITS.id) || !roles.has(item.role) || !string(item.text, LIMITS.text)) fail('INVALID_MESSAGE');
      const message = { id: item.id, role: item.role, text: item.text };
      const previous = messages.get(message.id);
      if (previous) {
        if (JSON.stringify(previous) !== JSON.stringify(message)) fail('CONFLICTING_MESSAGE_ID');
        duplicates += 1;
      } else messages.set(message.id, message);
    }
    const ticket = { id: input.id, subject: input.subject, messages: [...messages.values()] };
    const previous = byId.get(ticket.id);
    if (previous) {
      if (JSON.stringify(previous) !== JSON.stringify(ticket)) fail('CONFLICTING_TICKET_ID');
      duplicates += 1;
    } else byId.set(ticket.id, ticket);
  }
  return { tickets: [...byId.values()], duplicates };
}

/** Return the first customer message containing a rule phrase, or null.
 * This intentionally matches quoted training text too: human review decides
 * whether the evidence is a real unresolved complaint or a false positive.
 */
export function detect(ticket) {
  return ticket.messages.find(message => {
    if (message.role !== 'customer') return false;
    const text = message.text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    return /\b(?:es la segunda vez|asked twice)\b/u.test(text);
  }) ?? null;
}

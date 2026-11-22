const target = '2026-10-15';
const sources = {
  missing: null,
  stale: { date: '2026-10-14', counts: [29, 9], declaredTotal: 38 },
  mismatch: { date: target, counts: [38, 14], declaredTotal: 55 },
  valid: { date: target, counts: [38, 14], declaredTotal: 52 },
  zero: { date: target, counts: [0, 0], declaredTotal: 0 },
};

const en = document.documentElement.lang === 'en';
const copy = en ? {
  missing: 'Blocked. The source for October 15 is missing.',
  stale: 'Blocked. The source is from October 14. This report needs October 15.',
  mismatch: 'Blocked. The declared total is 55 and the two categories add up to 52.',
  valid: 'Validated. The two categories add up to the declared total of 52.',
  zero: 'Validated. The source is present and the two categories add up to zero.',
  csv: 'date,completed,pending,total',
} : {
  missing: 'Bloqueado. Falta la fuente del 15 de octubre.',
  stale: 'Bloqueado. La fuente es del 14 de octubre y el corte corresponde al 15.',
  mismatch: 'Bloqueado. El total declarado es 55 y las dos categorías suman 52.',
  valid: 'Validado. Las dos categorías suman 52 y coinciden con el total declarado.',
  zero: 'Validado. La fuente está presente y las dos categorías suman cero.',
  csv: 'fecha,completados,pendientes,total',
};

const form = document.querySelector('#report-form');
const source = document.querySelector('#report-source');
const status = document.querySelector('#report-status');
const download = document.querySelector('#report-download');
const history = document.querySelector('#report-history');
const events = document.querySelector('#report-events');
const reviewed = new Set();
let objectUrl;

function clearResult() {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = undefined;
  download.hidden = true;
  download.removeAttribute('href');
  status.textContent = '';
}

form.hidden = false;
source.addEventListener('change', clearResult);
form.addEventListener('submit', event => {
  event.preventDefault();
  clearResult();
  const data = sources[source.value];
  const result = !data ? 'missing' : data.date !== target ? 'stale'
    : data.counts.reduce((sum, count) => sum + count, 0) !== data.declaredTotal ? 'mismatch'
    : data.declaredTotal === 0 ? 'zero' : 'valid';
  status.textContent = copy[result];
  if (!reviewed.has(source.value)) {
    reviewed.add(source.value);
    const item = document.createElement('li');
    item.textContent = copy[result];
    events.append(item);
    history.hidden = false;
  }
  if (result === 'valid' || result === 'zero') {
    const values = [target, ...data.counts, data.declaredTotal].join(',');
    objectUrl = URL.createObjectURL(new Blob([copy.csv + '\n' + values + '\n'], { type: 'text/csv;charset=utf-8' }));
    download.href = objectUrl;
    download.hidden = false;
  }
});

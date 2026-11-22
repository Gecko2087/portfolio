// Entirely local illustration: no integrations, storage or network requests.
document.querySelectorAll('[data-channel-demo]').forEach((root) => {
  const copy = JSON.parse(root.dataset.demo);
  let route = 0;
  let step = 0;
  const find = (selector) => root.querySelector(selector);
  const write = (selector, text) => { find(selector).textContent = text; };
  const render = () => {
    const current = copy.routes[route];
    root.querySelectorAll('[data-route]').forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.route) === route));
    });
    root.querySelectorAll('[data-step]').forEach((button) => {
      if (Number(button.dataset.step) === step) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    write('[data-progress]', `${copy.step} ${step + 1} ${copy.of} ${copy.stages.length}`);
    write('[data-stage-title]', copy.stages[step]);
    write('[data-stage-description]', copy.details[step]);
    write('[data-source]', current.source);
    write('[data-record-label]', [copy.incoming, copy.rule, copy.response, copy.handoff][step]);
    write('[data-record-value]', [current.message, current.rule, current.response, current.handoff][step]);
    find('[data-previous]').disabled = step === 0;
    find('[data-next]').disabled = step === copy.stages.length - 1;
  };
  root.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => { route = Number(button.dataset.route); step = 0; render(); });
  });
  root.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => { step = Number(button.dataset.step); render(); });
  });
  find('[data-previous]').addEventListener('click', () => { step = Math.max(0, step - 1); render(); });
  find('[data-next]').addEventListener('click', () => { step = Math.min(copy.stages.length - 1, step + 1); render(); });
  find('[data-reset]').addEventListener('click', () => { step = 0; render(); });
});

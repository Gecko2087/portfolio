(() => {
  const form = document.querySelector('#contact-form'); if (!form) return;
  const en = document.documentElement.lang === 'en';
  const copy = en ? {
    submit:'Send message ↗', sending:'Sending…', success:'Your message was accepted for delivery. Thank you for reaching out.',
    pending:'Direct contact is being activated. You can reach me on LinkedIn in the meantime.',
    failure:'The message could not be confirmed. Your text is still here; please try again or contact me on LinkedIn.',
    limit:'The service has reached a submission limit. Please try later or use LinkedIn.',
    blocked:'The submission could not be processed.', invalid:'Please complete this field.',
    short:'Please add at least 10 characters so I can understand your message.',
    preview:'Your message is only sent when you choose Send message. It is not saved in this browser.'
  } : {
    submit:'Enviar mensaje ↗', sending:'Enviando…', success:'Tu mensaje fue aceptado para el envío. Gracias por escribir.',
    pending:'El contacto directo se está activando. Mientras tanto, puedes escribirme por LinkedIn.',
    failure:'No se pudo confirmar el envío. Tu texto sigue aquí; reintenta o escríbeme por LinkedIn.',
    limit:'El servicio alcanzó un límite de envíos. Prueba más tarde o usa LinkedIn.',
    blocked:'No se pudo procesar el envío.', invalid:'Completa este campo.',
    short:'Escribe al menos 10 caracteres para que pueda entender tu mensaje.',
    preview:'El mensaje se envía solo al pulsar Enviar mensaje. No se guarda en este navegador.'
  };
  const endpoint = window.portfolioContact?.endpoint;
  let configured = false;
  try {
    const url = new URL(endpoint);
    configured = url.protocol === 'https:' && url.origin === window.portfolioContact?.apiOrigin &&
      url.pathname === '/api/contact' && !url.search && !url.hash && !url.username && !url.password;
  } catch {}
  let previousPayload = null, requestId = null;
  const button = document.querySelector('#contact-submit'), status = document.querySelector('#contact-status');
  const message = form.elements.namedItem('message');
  const updateCount = () => { document.querySelector('#message-count').textContent = `${message.value.length} / 3000`; };
  message.addEventListener('input', updateCount); updateCount();
  document.querySelectorAll('[data-contact-intent]').forEach(chip => chip.addEventListener('click', () => {
    document.querySelectorAll('[data-contact-intent]').forEach(item => item.setAttribute('aria-pressed', String(item === chip)));
    form.elements.namedItem('interest').value = chip.dataset.contactIntent;
  }));
  button.disabled = !configured;
  if (configured) form.action = endpoint;
  status.textContent = configured ? copy.preview : copy.pending;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!configured || form.getAttribute('aria-busy') === 'true') return;
    if (form.elements.namedItem('_gotcha').value) { status.textContent = copy.blocked; return; }
    for (const name of ['name','email','message']) {
      const input = form.elements.namedItem(name); input.setCustomValidity('');
      if (!input.value.trim()) input.setCustomValidity(copy.invalid);
      if (name === 'message' && input.value.trim().length < 10) input.setCustomValidity(copy.short);
    }
    if (!form.reportValidity()) return;
    const data = {};
    for (const name of ['name','email','company','message','interest','_gotcha']) data[name] = String(form.elements.namedItem(name).value || '').trim();
    data.language = en ? 'en' : 'es';
    const payload = JSON.stringify(data);
    if (previousPayload !== payload || !requestId) { requestId = crypto.randomUUID(); previousPayload = payload; }
    data.requestId = requestId;
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
    const controls = [...form.querySelectorAll('input,textarea,button')];
    controls.forEach(input => { input.disabled = true; });
    form.setAttribute('aria-busy', 'true'); button.disabled = true; button.textContent = copy.sending;
    status.textContent = copy.sending;
    try {
      const response = await fetch(endpoint, {method:'POST', body:JSON.stringify(data), headers:{Accept:'application/json','Content-Type':'application/json'}, signal:controller.signal, credentials:'omit', redirect:'error'});
      const result = await response.json();
      if (!response.ok || result?.ok !== true || result.code !== 'accepted' || result.requestId !== requestId) { status.textContent = response.status === 429 ? copy.limit : copy.failure; return; }
      form.reset(); previousPayload = null; requestId = null; updateCount(); status.textContent = copy.success;
      document.querySelectorAll('[data-contact-intent]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.contactIntent === 'job')));
    } catch { status.textContent = copy.failure; }
    finally {clearTimeout(timeout); form.removeAttribute('aria-busy'); controls.forEach(input => { input.disabled = false; }); button.textContent = copy.submit;}
  });
  for (const input of form.querySelectorAll('input,textarea')) input.addEventListener('input', () => input.setCustomValidity(''));
})();

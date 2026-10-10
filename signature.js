(() => {
  const board = document.querySelector('#signal-board');
  if (!board) return;
  const en = document.documentElement.lang === 'en';
  const copy = en ? {
    call: {code:'CALL / SAMPLE-014', input:'A conversation with two speakers.', steps:['Transcription','Criteria analysis','Human review'], good:'A structured review, ready for a person to assess.', issue:'Incomplete audio.', held:'Insufficient context. Human review is needed before drawing conclusions.', detail:'In my work: call transcription, speaker identification and AI-assisted quality analysis.'},
    report: {code:'REPORT / SAMPLE-027', input:'An export with a stated reporting date.', steps:['Source coverage','Processing','Report'], good:'The source is complete for the stated date. The report can be prepared.', issue:'Missing reporting date.', held:'The report waits. An older file cannot establish coverage for this date.', detail:'In my work: data extraction, reporting automation and indicators with Excel and Power BI.'},
    api: {code:'INTEGRATION / SAMPLE-008', input:'A customer service system requests an update.', steps:['Validate input','Connect service','Confirm result'], good:'A valid response confirms the requested update.', issue:'No service response.', held:'No confirmation. The interface keeps the operation pending instead of assuming success.', detail:'In my work: API integration for CRM, WhatsApp and customer service platforms.'},
    ready:'Ready to review', waiting:'Needs attention', missing:'Introduce an incomplete input', restore:'Restore the complete input', note:'Conceptual walkthrough · Fictional data · No live services', entry:'INPUT', result:'RESULT'
  } : {
    call: {code:'LLAMADA / EJEMPLO-014', input:'Una conversación con dos hablantes.', steps:['Transcripción','Análisis de criterios','Revisión humana'], good:'Una revisión estructurada, lista para que una persona la evalúe.', issue:'Audio incompleto.', held:'Falta contexto. Hace falta revisión humana antes de sacar conclusiones.', detail:'En mi trabajo: transcripción de llamadas, identificación de hablantes y análisis de calidad asistido por IA.'},
    report: {code:'REPORTE / EJEMPLO-027', input:'Una exportación con fecha de corte definida.', steps:['Cobertura de fuentes','Procesamiento','Reporte'], good:'La fuente cubre la fecha indicada. Se puede preparar el reporte.', issue:'Fecha de corte ausente.', held:'El reporte espera. Un archivo anterior no demuestra cobertura para esta fecha.', detail:'En mi trabajo: extracción de datos, automatización de reportes e indicadores con Excel y Power BI.'},
    api: {code:'INTEGRACIÓN / EJEMPLO-008', input:'Un sistema de atención solicita una actualización.', steps:['Validar entrada','Conectar servicio','Confirmar resultado'], good:'Una respuesta válida confirma la actualización solicitada.', issue:'El servicio no responde.', held:'Sin confirmación. La interfaz mantiene la operación pendiente en lugar de asumir el éxito.', detail:'En mi trabajo: integración de APIs para CRM, WhatsApp y plataformas de atención.'},
    ready:'Listo para revisar', waiting:'Necesita atención', missing:'Introducir una entrada incompleta', restore:'Restaurar la entrada completa', note:'Recorrido conceptual · Datos ficticios · Sin servicios en vivo', entry:'ENTRADA', result:'RESULTADO'
  };
  let selected = 'call', incomplete = false;
  const transition = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    board.querySelectorAll('.signal-record, .signal-result, .signal-steps').forEach(element => {
      element.getAnimations().forEach(animation => animation.cancel());
      element.animate([{opacity:.35, transform:'translateY(5px)'},{opacity:1, transform:'translateY(0)'}], {duration:280, easing:'cubic-bezier(.22,1,.36,1)'});
    });
  };
  const render = () => {
    const scenario = copy[selected];
    document.querySelector('#signal-code').textContent = scenario.code;
    document.querySelector('#signal-input').textContent = incomplete ? scenario.issue : scenario.input;
    document.querySelector('#signal-state').textContent = incomplete ? copy.waiting : copy.ready;
    document.querySelector('#signal-output').textContent = incomplete ? scenario.held : scenario.good;
    document.querySelector('#signal-context').textContent = scenario.detail;
    document.querySelector('#signal-test').textContent = incomplete ? copy.restore : copy.missing;
    document.querySelector('#signal-test').setAttribute('aria-pressed', String(incomplete));
    board.classList.toggle('needs-review', incomplete);
    const steps = document.querySelector('#signal-steps'); steps.replaceChildren();
    scenario.steps.forEach((text, index) => {
      const li = document.createElement('li'), number = document.createElement('span'), label = document.createElement('strong');
      number.textContent = String(index + 1).padStart(2, '0'); label.textContent = text;
      li.append(number, label); steps.append(li);
    });
    document.querySelectorAll('[data-signal]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.signal === selected)));
  };
  document.querySelectorAll('[data-signal]').forEach(button => button.addEventListener('click', () => { selected = button.dataset.signal; incomplete = false; render(); transition(); }));
  document.querySelector('#signal-test').addEventListener('click', () => { incomplete = !incomplete; render(); transition(); });
  render();
})();

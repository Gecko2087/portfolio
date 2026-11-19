(() => {
const en=document.documentElement.lang==='en', prefix=en?'lab-en.html':'lab.html', helpdeskDemo='https://helpdesk-ia-demo.portfolio-lucas-nieto.workers.dev/';
const projects={
 helpdesk:{name:'HelpDesk IA',index:'01',type:en?'SUPPORT WITH JUDGMENT':'SOPORTE CON CRITERIO',description:en?'Describe an incident, review the diagnosis and save the ticket to its history.':'Describe un incidente, revisa el diagnóstico y guarda el ticket en su historial.',stack:'React · Cloudflare Workers · D1',repo:'helpdesk-ia',demo:helpdeskDemo,boundary:en?'Tickets stored in D1, with fictional data and isolated one-hour workspaces. Rule-based analysis while Gemini is pending. Demo in Spanish.':'Tickets en D1, espacios aislados de una hora y datos ficticios. Análisis por reglas mientras se habilita Gemini.'},
 passforge:{name:'PassForge',index:'02',type:en?'GENERATE / ORGANIZE':'GENERAR / ORGANIZAR',description:en?'Generate a password with Web Crypto, adjust its options and organize fictional records in a temporary vault.':'Genera una clave con Web Crypto, ajusta sus opciones y organiza registros ficticios en una bóveda temporal.',stack:'Next.js · TypeScript · Prisma · Better Auth',repo:'passforge-nextjs-prisma',demo:'https://passforge-demo.portfolio-lucas-nieto.workers.dev',boundary:en?'Real API and D1 persistence. Isolated one-hour visitor sessions. Use fictional passwords only. Interface in Spanish.':'API y persistencia D1 reales. Sesiones de visitante aisladas durante una hora. Usa solo contraseñas ficticias.'},
 taskapi:{name:'Task API',index:'04',type:en?'TASKS / ROLES':'TAREAS / ROLES',description:en?'Explore a task board with administrator and employee views.':'Explora un tablero de tareas con vistas de administrador y empleado.',stack:'Laravel · Vue · Sanctum',repo:'task-rest-api',boundary:en?'Interactive frontend preview with simulated API responses. The repository contains the Laravel backend.':'Vista interactiva con respuestas de API simuladas. El repositorio contiene el backend Laravel.'},
 gamerhub:{name:'GamerHub',index:'03',type:en?'PLAY / DISCOVER':'JUGAR / DESCUBRIR',description:en?'Explore real free-to-play games and save favorites to a temporary profile.':'Explora juegos gratuitos reales y guarda favoritos en un perfil temporal.',stack:'React · Cloudflare Workers · D1',repo:'gamerhub-frontend',demo:'https://gamerhub-demo.portfolio-lucas-nieto.workers.dev/login',boundary:en?'FreeToGame catalog and D1 persistence. Temporary visitor session. Demo in Spanish.':'Catálogo de FreeToGame y favoritos en D1. Sesión temporal de visitante.'}
};
const tabs=[...document.querySelectorAll('[data-showcase]')], stage=document.querySelector('#showcase');
const image=document.querySelector('#showcase-image'); let active='helpdesk';
function setDestination(link,href){link.href=href;const external=href.startsWith('https://');if(external){link.target='_blank';link.rel='noopener noreferrer';}else{link.removeAttribute('target');link.removeAttribute('rel');}}
function select(key){if(!projects[key])return;active=key;stage.dataset.project=key;const p=projects[key],demo=p.demo||prefix+'?project='+key;tabs.forEach(tab=>{const selected=tab.dataset.showcase===key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});document.querySelector('#showcase-panel').setAttribute('aria-labelledby','tab-'+key);document.querySelector('#showcase-index').textContent=p.index+' / 04';document.querySelector('#showcase-type').textContent=p.index+' / '+p.type;const title=document.querySelector('#showcase-title');title.replaceChildren(document.createTextNode(p.name));const arrow=document.createElement('span');arrow.textContent='↗';title.append(arrow);document.querySelector('#showcase-description').textContent=p.description;document.querySelector('#showcase-stack').textContent=p.stack;document.querySelector('#showcase-boundary').textContent=p.boundary;document.querySelector('#screen-label').textContent=p.name.toUpperCase()+' / DEMO';setDestination(document.querySelector('#showcase-demo'),demo);document.querySelector('#showcase-code').href='https://github.com/Gecko2087/'+p.repo;const link=document.querySelector('#showcase-image-link');setDestination(link,demo);link.setAttribute('aria-label',(en?'Try ':'Probar ')+p.name);stage.classList.remove('is-changing');void stage.offsetWidth;stage.classList.add('is-changing');image.src=key==='taskapi'?'project-taskapi-'+(en?'en':'es')+'.webp':key==='helpdesk'?'project-helpdesk-live.webp':key==='gamerhub'?'project-gamerhub-live.webp':'project-'+key+(en?'-en':'')+'.png';image.alt=(en?'Authentic screenshot of the interactive demo of ':'Captura auténtica de la demo interactiva de ')+p.name+(en?' with fictional data':' con datos ficticios');}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab.dataset.showcase));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(tabs[next].dataset.showcase);tabs[next].focus();});});
document.querySelectorAll('[data-project="helpdesk"]').forEach(button=>button.addEventListener('click',()=>{const links=[...document.querySelectorAll('#case-content .dialog-links a')],demoLink=links.find(link=>link.href.includes('project=helpdesk'));if(demoLink)setDestination(demoLink,helpdeskDemo);const note=document.querySelector('#case-content .source-note');if(note)note.textContent=en?'The public demo runs on Workers and D1. Workspaces expire after one hour and analysis uses rules while Gemini is pending. The interface is in Spanish.':'La demo pública usa Workers y D1. Cada espacio vence después de una hora y el análisis funciona por reglas mientras se habilita Gemini.';}));
const toggle=document.querySelector('#motion-toggle');toggle.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',en?(paused?'Enable animations':'Pause animations'):(paused?'Activar animaciones':'Pausar animaciones'));toggle.textContent=paused?'▷':'Ⅱ';});
if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion-paused');toggle.setAttribute('aria-pressed','true');toggle.setAttribute('aria-label',en?'Reduced motion follows your system settings':'Movimiento reducido según tu sistema');toggle.disabled=true;toggle.textContent='▷';}
const copy=document.querySelector('#copy-contact');
const notice=document.querySelector('#portfolio-notice');
if(copy && navigator.clipboard?.writeText){
  copy.hidden=false;
  let clearNotice;
  copy.addEventListener('click',async()=>{
    try{
      const email=document.querySelector('.email-link').getAttribute('href').slice(7);
      await navigator.clipboard.writeText(email);
      notice.textContent=en?'Email address copied.':'Correo copiado.';
    }catch{
      notice.textContent=en?'Could not copy. The address is available under Contact.':'No se pudo copiar. El correo está en Contacto.';
    }
    clearTimeout(clearNotice);
    clearNotice=setTimeout(()=>{notice.textContent='';},5500);
  });
}
document.querySelectorAll('[data-project="gamerhub"]').forEach(button=>button.addEventListener('click',()=>{
  const note=document.querySelector('#case-content .source-note');
  if(note)note.textContent=en?'The original live demo uses a temporary visitor session. The interface is in Spanish.':'La demo original utiliza una sesión temporal de visitante.';
}));
const backToTop = document.querySelector('#back-to-top');
const intro = document.querySelector('.recruiter-hero');
if (backToTop && intro) {
  backToTop.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#inicio').focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  });
}
// Keep the section navigation and reading indicator in sync with the viewport.
const sectionLinks = [...document.querySelectorAll('.nav nav a[href^="#"], .career-map a[href^="#"]')];
const sections = ['inicio', 'proyectos', 'sobre', 'contacto'].map(id => document.getElementById(id));
const meter = document.querySelector('.reading-progress');
let frame = 0;
let currentSection;
function updateReadingPosition() {
  frame = 0;
  if (backToTop && intro) backToTop.hidden = intro.getBoundingClientRect().bottom > 0;
  const scrollRange = document.documentElement.scrollHeight - innerHeight;
  const progress = scrollRange > 0 ? Math.min(1, Math.max(0, scrollY / scrollRange)) : 0;
  meter.style.transform = `scaleX(${progress})`;
  const threshold = Math.min(innerHeight * .35, 240);
  const current = progress >= .995 && scrollRange > 0
    ? sections.at(-1)
    : sections.findLast(section => section.getBoundingClientRect().top <= threshold);
  if (current === currentSection) return;
  currentSection = current;
  sectionLinks.forEach(link => {
    if (link.hash === '#' + current?.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleReadingUpdate() {
  if (!frame) frame = requestAnimationFrame(updateReadingPosition);
}
window.addEventListener('scroll', scheduleReadingUpdate, { passive: true });
window.addEventListener('resize', scheduleReadingUpdate);
window.addEventListener('load', scheduleReadingUpdate, { once: true });
scheduleReadingUpdate();

document.querySelectorAll('[data-feature]').forEach(button => {
  button.addEventListener('click', () => {
    const tab = tabs.find(item => item.dataset.showcase === button.dataset.feature);
    if (!tab) return;
    select(tab.dataset.showcase);
    tab.focus({ preventScroll: true });
    stage.scrollIntoView({ block: 'start' });
  });
});
const motionAllowed = matchMedia('(prefers-reduced-motion: no-preference)');
if ('IntersectionObserver' in window && motionAllowed.matches) {
  const cards = document.querySelectorAll('.work-card');
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('card-arrived');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .15 });
  cards.forEach(card => reveal.observe(card));
}

const preview = document.querySelector('#showcase-image-link');
preview.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !motionAllowed.matches || document.body.classList.contains('motion-paused')) return;
  const rect = preview.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  preview.style.setProperty('--preview-x', (y * -6) + 'deg');
  preview.style.setProperty('--preview-y', (x * 8) + 'deg');
});
preview.addEventListener('pointerleave', () => {
  preview.style.removeProperty('--preview-x');
  preview.style.removeProperty('--preview-y');
});
select(active);
})();

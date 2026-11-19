(() => {
 const en=document.documentElement.lang==='en';
 const previews={
  gamerhub:{name:'GamerHub',image:'project-gamerhub-live.webp',demo:'https://gamerhub-demo.portfolio-lucas-nieto.workers.dev/login',description:en?'Game discovery and profile favorites.':'Catálogo de juegos y favoritos por perfil.'},
  helpdesk:{name:'HelpDesk IA',image:'project-helpdesk-live.webp',demo:'https://helpdesk-ia-demo.portfolio-lucas-nieto.workers.dev/',description:en?'Tickets, notes and rule-based analysis.':'Tickets, notas y análisis por reglas.'},
  passforge:{name:'PassForge',image:en?'project-passforge-en.png':'project-passforge.png',demo:'https://passforge-demo.portfolio-lucas-nieto.workers.dev/',description:en?'Web Crypto generator and temporary demo vault.':'Generador Web Crypto y bóveda demo temporal.'},
  taskapi:{name:'Task API',image:en?'project-taskapi-en.webp':'project-taskapi-es.webp',demo:(en?'lab-en.html':'lab.html')+'?project=taskapi',description:en?'A task board with simulated API responses.':'Tablero de tareas con respuestas de API simuladas.'}
 };
 const image=document.querySelector('#hero-preview-image'),open=document.querySelector('#hero-image-open'),buttons=[...document.querySelectorAll('[data-preview]')];
 function select(key){const p=previews[key];if(!p)return;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.preview===key)));document.querySelector('#preview-name').textContent=p.name;document.querySelector('#preview-description').textContent=p.description;const demo=document.querySelector('#preview-demo');demo.href=p.demo;if(p.demo.startsWith('https:')){demo.target='_blank';demo.rel='noopener noreferrer';}else{demo.removeAttribute('target');demo.removeAttribute('rel');}image.src=p.image;image.alt=(en?'Real screenshot of ':'Captura real de ')+p.name+(en?' with demo data':' con datos de demostración');open.setAttribute('aria-label',(en?'Enlarge screenshot of ':'Ampliar captura de ')+p.name);open.classList.remove('is-swapping');void open.offsetWidth;open.classList.add('is-swapping');
  document.dispatchEvent(new CustomEvent('project-selected', { detail: key }));
 }
 buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.preview)));
 const dialog=document.querySelector('#screenshot-dialog'),detail=document.querySelector('#screenshot-detail'),caption=document.querySelector('#screenshot-caption');let trigger;
 dialog.classList.add('screenshot-view');
 function enlarge(source,button){trigger=button;detail.src=source.currentSrc||source.src;detail.alt=source.alt;caption.textContent=source.alt;dialog.showModal();document.body.style.overflow='hidden';}
 open.addEventListener('click',()=>enlarge(image,open));
 document.querySelectorAll('[data-capture]').forEach(button=>button.addEventListener('click',()=>enlarge(button.closest('.work-visual').querySelector('img'),button)));
 dialog.addEventListener('close',()=>{document.body.style.overflow='';trigger?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 // Progressive enhancement: content stays visible if JS or observation is unavailable.
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('just-revealed');observer.unobserve(entry.target);});},{threshold:.12});document.querySelectorAll('.work-card,.experience-panel,.contact-panel').forEach(element=>observer.observe(element));}
})();

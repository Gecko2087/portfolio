/* Local interface demonstrations. No requests, credentials or user data. */
(() => {
  const stage=document.querySelector('#interface-lab');
  if(!stage)return;
  const en=document.documentElement.lang==='en';
  const body=document.querySelector('#window-body');
  const windowPanel=document.querySelector('#interface-window');
  const feedback=document.querySelector('#stage-feedback');
  const controls=[...document.querySelectorAll('[data-scene-select]')];
  const motion=document.querySelector('#motion-toggle');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  const state={priority:false,revealed:false,favorite:false,done:0};
  let selected='helpdesk',paused=false,frame=0;
  const t=(es,english)=>en?english:es;
  const names={helpdesk:'HelpDesk IA',passforge:'PassForge',gamerhub:'GamerHub',taskapi:'Task API'};
  const icons={helpdesk:'✳',passforge:'⌑',gamerhub:'✛',taskapi:'☷'};
  const labels={helpdesk:t('SOPORTE CON CRITERIO','SUPPORT WITH JUDGMENT'),passforge:t('IDENTIDAD Y ORGANIZACIÓN','IDENTITY AND ORGANIZATION'),gamerhub:t('ENCUENTRA TU COMUNIDAD','FIND YOUR COMMUNITY'),taskapi:t('DE LA ACCIÓN AL ESTADO','FROM ACTION TO STATE')};
  const header=()=>`<div class="preview-heading"><span class="preview-icon">${icons[selected]}</span><div><h2>${names[selected]}</h2><p>${labels[selected]}</p></div><span class="preview-pill">DEMO</span></div>`;
  const action=label=>`<button class="preview-action" id="stage-action" type="button">${label}<span aria-hidden="true">↗</span></button>`;
  const render=(animate=false,restoreFocus=false)=>{
    let markup=header();
    if(selected==='helpdesk'){
      markup+=`<div class="preview-summary"><div><span>2</span><small>${t('Tickets de ejemplo','Sample tickets')}</small></div><div class="mini-wave" aria-hidden="true">${'<i></i>'.repeat(9)}</div></div><div class="preview-ticket"><span class="ticket-line-icon" aria-hidden="true">↳</span><div><strong>${t('No puedo acceder al CRM','Cannot access the CRM')}</strong><small>#DEMO-014 · ${t('Accesos','Access')}</small></div><span class="priority-tag" id="stage-priority">${state.priority?t('Normal','Normal'):t('Alta','High')}</span></div><div class="preview-ticket secondary-ticket"><span class="ticket-line-icon" aria-hidden="true">↳</span><div><strong>${t('Configurar correo','Set up email')}</strong><small>#DEMO-015 · ${t('Aplicaciones','Applications')}</small></div><span class="muted-tag">Normal</span></div><div class="preview-assist"><span aria-hidden="true">✦</span><p>${t('La IA sugiere.','AI suggests.')}<br><strong>${t('Una persona decide.','A person decides.')}</strong></p><span class="assist-check" aria-hidden="true">✓</span></div>${action(t('Cambiar prioridad','Change priority'))}`;
    }else if(selected==='passforge'){
      markup+=`<div class="vault-display"><span class="vault-label">${t('REGISTRO DE EJEMPLO','SAMPLE RECORD')}</span><div class="vault-value">${state.revealed?'DEMO-ONLY-024':'•••• •••• ••••'}</div><div class="vault-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div><p class="vault-note">${t('Un ejemplo visual. No es una contraseña para usar.','A visual example. Not a password to use.')}</p><div class="vault-records"><span>${t('Personal','Personal')}</span><span>${t('Trabajo','Work')}</span><span>${t('Servicios','Services')}</span></div>${action(state.revealed?t('Ocultar ejemplo','Hide example'):t('Mostrar ejemplo','Show example'))}`;
    }else if(selected==='gamerhub'){
      markup+=`<div class="game-preview"><div class="game-tile"><span class="game-glyph" aria-hidden="true">◈</span><strong>ORBIT RUN</strong><small>${t('AVENTURA / EJEMPLO','ADVENTURE / SAMPLE')}</small></div><div class="game-tile"><span class="game-glyph" aria-hidden="true">△</span><strong>NEON FIELD</strong><small>${t('ESTRATEGIA / EJEMPLO','STRATEGY / SAMPLE')}</small></div></div><p class="favorite-state">${state.favorite?'♥':'♡'} ${state.favorite?t('1 favorito en esta sesión','1 favorite in this session'):t('Tu próxima partida empieza aquí.','Your next game starts here.')}</p>${action(state.favorite?t('Quitar Orbit Run de favoritos','Remove Orbit Run from favorites'):t('Guardar Orbit Run en favoritos','Save Orbit Run to favorites'))}`;
    }else{
      const tasks=en?['Define the endpoint','Validate the input','Review the response']:['Definir el endpoint','Validar la entrada','Revisar la respuesta'];
      markup+=`<div class="task-progress" aria-hidden="true">${tasks.map((_,i)=>`<i${i<state.done?' class="done"':''}></i>`).join('')}</div>${tasks.map((task,i)=>`<div class="mini-task${i<state.done?' done':''}"><span aria-hidden="true">${i<state.done?'✓':''}</span>${task}${i<state.done?`<small class="sr-only"> ${t('completada','completed')}</small>`:''}</div>`).join('')}<p class="task-count">${state.done} / 3 ${t('TAREAS COMPLETADAS','TASKS COMPLETED')}</p>${action(state.done===3?t('Reiniciar tablero','Reset board'):t('Completar siguiente tarea','Complete next task'))}`;
    }
    body.innerHTML=markup;
    document.querySelector('#stage-action').addEventListener('click',()=>{
      if(selected==='helpdesk'){state.priority=!state.priority;feedback.textContent=t('Prioridad actualizada en esta vista de ejemplo.','Priority updated in this example view.');}
      if(selected==='passforge'){state.revealed=!state.revealed;feedback.textContent=state.revealed?t('Ejemplo visible. El control permite volver a ocultarlo.','Example visible. Use the control to hide it again.'):t('Ejemplo oculto.','Example hidden.');}
      if(selected==='gamerhub'){state.favorite=!state.favorite;feedback.textContent=state.favorite?t('Guardado en memoria para esta sesión.','Saved in memory for this session.'):t('Favorito eliminado de esta sesión.','Favorite removed from this session.');}
      if(selected==='taskapi'){state.done=(state.done+1)%4;feedback.textContent=state.done===3?t('Flujo completo. Puedes reiniciar el tablero.','Workflow complete. You can reset the board.'):t('El estado y el progreso cambian juntos.','State and progress update together.');}
      render(false,true);
    });
    if(restoreFocus)document.querySelector('#stage-action').focus({preventScroll:true});
    if(animate&&!paused&&!reduce.matches){body.getAnimations().forEach(a=>a.cancel());body.animate([{opacity:.1,transform:'translateY(12px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});}
  };
  const choose=key=>{
    selected=key;stage.dataset.scene=key;
    controls.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sceneSelect===key)));
    document.querySelector('#window-address').textContent=`lucas / ${key==='helpdesk'?'helpdesk-ia':key}`;
    document.querySelector('#stage-demo').href=`${en?'lab-en.html':'lab.html'}?project=${key}`;
    feedback.textContent=t(`Explora ${names[key]}. Prueba la acción de la interfaz.`,`Explore ${names[key]}. Try the interface action.`);
    render(true);
  };
  controls.forEach((button,index)=>{
    button.addEventListener('click',()=>choose(button.dataset.sceneSelect));
    button.addEventListener('keydown',event=>{
      let next;if(event.key==='ArrowRight')next=(index+1)%controls.length;else if(event.key==='ArrowLeft')next=(index-1+controls.length)%controls.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=controls.length-1;else return;
      event.preventDefault();controls[next].focus();choose(controls[next].dataset.sceneSelect);
    });
  });
  const updateMotion=()=>{
    const stopped=paused||reduce.matches;
    document.body.classList.toggle('motion-paused',stopped);
    motion.setAttribute('aria-pressed',String(stopped));
    motion.textContent=reduce.matches?t('Movimiento reducido','Reduced motion'):paused?t('Activar movimiento','Enable motion'):t('Pausar movimiento','Pause motion');
    motion.disabled=reduce.matches;
    windowPanel.style.transform='';
  };
  motion.addEventListener('click',()=>{paused=!paused;updateMotion();});
  reduce.addEventListener('change',updateMotion);
  const depth=stage.querySelector('.stage-depth');
  depth.addEventListener('pointermove',event=>{
    if(paused||reduce.matches||!pointer.matches||windowPanel.contains(document.activeElement))return;
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      const r=depth.getBoundingClientRect();
      const x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;
      windowPanel.style.transform=`rotateY(${-8+x*5}deg) rotateX(${5-y*4}deg) rotateZ(-3deg)`;
    });
  });
  depth.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);windowPanel.style.transform='';});
  windowPanel.addEventListener('focusin',()=>{cancelAnimationFrame(frame);windowPanel.style.transform='';});
  updateMotion();render();
})();

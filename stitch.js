/* Architecture path from the Google Stitch composition. Local UI only. */
(() => {
 const controls=[...document.querySelectorAll('[data-layer]')];
 const detail=document.querySelector('#architecture-detail');
 if(!detail||!controls.length)return;
 const en=document.documentElement.lang==='en';
 const descriptions=en?{
  idea:['It starts with a question.','What people need and what the system must solve.'],
  interface:['An action should feel clear.','States, feedback, keyboard access and responsive interfaces.'],
  api:['The rules live on the server.','Input validation, permissions and consistent responses.'],
  data:['A system needs context.','Relationships, persistence and a model that supports the workflow.']
 }:{
  idea:['Todo empieza con una pregunta.','Qué necesita la persona y qué debe resolver el sistema.'],
  interface:['Una acción debe sentirse clara.','Estados, respuesta, acceso por teclado e interfaces adaptables.'],
  api:['Las reglas viven en el servidor.','Validación de entradas, permisos y respuestas consistentes.'],
  data:['Un sistema necesita contexto.','Relaciones, persistencia y un modelo que acompañe el flujo.']
 };
 controls.forEach((button,index)=>{
  button.addEventListener('click',()=>{
   controls.forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
   const [heading,copy]=descriptions[button.dataset.layer];
   const strong=document.createElement('strong');strong.textContent=heading;
   detail.replaceChildren(strong,document.createTextNode(' '+copy));
  });
  button.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();
   const next=event.key==='Home'?0:event.key==='End'?controls.length-1:(index+(event.key==='ArrowRight'?1:-1)+controls.length)%controls.length;
   controls[next].focus();controls[next].click();
  });
 });
})();

/* Shortcut to actual project evidence using the existing accessible case dialog. */
(() => {
  const evidence = document.querySelector('#role-evidence');
  if (!evidence) return;
  const en = document.documentElement.lang === 'en';
  const projects = {fullstack:['helpdesk','HelpDesk IA'],backend:['taskapi','Task API'],ai:['helpdesk','HelpDesk IA']};
  let selected='fullstack';
  document.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => {
    selected=button.dataset.role;
    evidence.textContent = en ? `Read the ${projects[selected][1]} case ↗` : `Leer el caso de ${projects[selected][1]} ↗`;
  }));
  evidence.addEventListener('click', () => {
    const trigger=document.querySelector(`[data-project="${projects[selected][0]}"]`);
    trigger?.click();
    const dialog=document.querySelector('#case-dialog');
    // Returning focus to the initiating shortcut keeps keyboard users in their context.
    dialog?.addEventListener('close', () => evidence.focus(), {once:true});
  });
})();

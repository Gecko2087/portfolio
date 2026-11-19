(() => {
  const en = document.documentElement.lang === 'en';
  const cases = {
    helpdesk: en
      ? ['The public demo runs on Cloudflare Workers and stores tickets, categories, notes and events in D1. Each visitor has a temporary workspace.',
         ['Input validation with Zod and prepared SQL statements.', 'Workspace ownership checks on each ticket and category.', 'Session limits and a daily analysis quota. Gemini is not currently enabled in the public demo.'],
         'Create a ticket, add a note, change its status and review the event history. Analysis currently uses local rules.']
      : ['La demo pública utiliza Cloudflare Workers y guarda tickets, categorías, notas y eventos en D1. Cada visitante recibe un espacio temporal.',
         ['Validación de entradas con Zod y consultas SQL preparadas.', 'Comprobación del propietario en cada ticket y categoría.', 'Límites por sesión y cupo diario de análisis. Gemini espera la configuración de su secreto en el servidor.'],
         'Crea un ticket, agrega una nota, cambia su estado y consulta el historial. El análisis actual utiliza reglas locales.'],
    gamerhub: en
      ? ['React runs alongside its API on a Cloudflare Worker. FreeToGame supplies the catalog, and D1 stores temporary profiles and favorites.',
         ['Same-origin frontend and API.', 'Isolated visitor sessions that expire after one hour.', 'Cached game catalog and a shared favorites counter across views.'],
         'Create or switch profiles, search games, open a detail page and save or remove a favorite. The original Express and MongoDB backend remains available in its repository.']
      : ['React y su API se publican en Cloudflare Workers. FreeToGame aporta el catálogo y D1 guarda perfiles y favoritos temporales.',
         ['Frontend y API bajo el mismo origen.', 'Sesiones aisladas por visitante con duración de una hora.', 'Catálogo en caché y contador de favoritos compartido entre vistas.'],
         'Crea o cambia de perfil, busca juegos, abre una ficha y agrega o quita favoritos. El backend original con Express y MongoDB continúa en su repositorio.'],
  };
  document.querySelectorAll('button[data-project]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.project;
      const updated = cases[key];
      if (!updated) return;
      const content = document.querySelector('#case-content');
      const headings = content.querySelectorAll('h3');
      headings[1].nextElementSibling.textContent = updated[0];
      const decisions = headings[2].nextElementSibling;
      decisions.replaceChildren(...updated[1].map(text => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
      }));
      headings[3].nextElementSibling.textContent = updated[2];
      const note = content.querySelector('.source-note');
      note.textContent = en ? 'Demo data is fictional and changes are temporary.' : 'Los datos de la demo son ficticios y los cambios son temporales.';
    });
  });

})();

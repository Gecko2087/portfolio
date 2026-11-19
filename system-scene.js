(() => {
  const en = document.documentElement.lang === 'en';
  const scene = document.querySelector('.system-scene');
  if (!scene) return;
  const buttons = [...scene.querySelectorAll('[data-layer]')];
  const description = scene.querySelector('#layer-description');
  const systems = {
    helpdesk: {
      title: 'HelpDesk IA',
      tech: ['React', 'Workers', 'D1'],
      es: ['Crea un ticket, revisa su estado y consulta su historial.',
        'La API valida los datos y comprueba que cada ticket pertenezca al espacio del visitante.',
        'Tickets, notas y eventos se guardan en D1. Cada espacio de prueba vence en una hora.'],
      en: ['Create a ticket, review its status and read its history.',
        'The API validates input and checks that each ticket belongs to the visitor’s workspace.',
        'Tickets, notes and events are stored in D1. Each demo workspace expires after one hour.'],
    },
    passforge: {
      title: 'PassForge',
      tech: ['Next.js', 'Better Auth', 'D1'],
      es: ['Genera una clave con Web Crypto y organiza registros de prueba en una bóveda.',
        'Las rutas de Next.js utilizan sesiones de Better Auth para identificar al visitante.',
        'D1 conserva los registros del espacio temporal. La demo está pensada para datos ficticios.'],
      en: ['Generate a password with Web Crypto and organize fictional records in a vault.',
        'Next.js routes use Better Auth sessions to identify the visitor.',
        'D1 stores records in the temporary workspace. The demo is intended for fictional data.'],
    },
    gamerhub: {
      title: 'GamerHub',
      tech: ['React', 'Workers', 'D1'],
      es: ['Explora juegos de FreeToGame y guarda favoritos en distintos perfiles.',
        'El Worker consulta el catálogo y valida la sesión antes de modificar perfiles y favoritos.',
        'D1 guarda perfiles, favoritos y una copia del catálogo para responder si el proveedor falla.'],
      en: ['Explore FreeToGame titles and save favorites to different profiles.',
        'The Worker retrieves the catalog and validates the session before changing profiles and favorites.',
        'D1 stores profiles, favorites and a catalog copy to use when the provider is unavailable.'],
    },
    taskapi: {
      title: 'Task API',
      tech: ['Vue', en ? 'Simulated' : 'Simulada', en ? 'Local demo' : 'Demo local'],
      es: ['Prueba un tablero con vistas de administrador y empleado.',
        'Esta vista simula las respuestas. El repositorio contiene la API Laravel con Sanctum y roles.',
        'Los cambios de la vista interactiva son locales. La demo muestra el flujo sin ejecutar Laravel.'],
      en: ['Try a task board with administrator and employee views.',
        'This preview simulates responses. The repository contains the Laravel API with Sanctum and roles.',
        'Preview changes are local. The demo illustrates the workflow without running Laravel.'],
    },
  };
  let project = scene.dataset.systemProject;
  let layer = 0;

  function render(animate) {
    const system = systems[project];
    scene.dataset.systemProject = project;
    scene.querySelector('#system-project').textContent = system.title;
    const keys = ['interface', 'api', 'data'];
    buttons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === layer));
      scene.querySelector('#layer-' + keys[index] + '-tech').textContent = system.tech[index];
    });
    description.textContent = system[en ? 'en' : 'es'][layer];
    scene.classList.remove('is-tracing');
    if (animate) {
      void scene.offsetWidth;
      scene.classList.add('is-tracing');
    }
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      layer = index;
      render(true);
    });
  });
  document.addEventListener('project-selected', event => {
    if (!systems[event.detail]) return;
    project = event.detail;
    render(true);
  });
  render(false);
})();

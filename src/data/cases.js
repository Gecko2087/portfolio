import content from './content.json';

const cases = {
  helpdesk: {
    es: ['De una propuesta de triaje a una decisión verificable', 'Construí una mesa de ayuda que conserva la propuesta de análisis junto a la prioridad decidida por una persona. Cada corrección deja un motivo visible en el historial.', 'El servidor emite una referencia temporal para cada análisis y la vincula con el ticket y el espacio del visitante. D1 conserva la propuesta y guarda cada corrección con sus valores anteriores y nuevos.', ['En la demo, abre «Nuevo ticket», elige «CRM» y pulsa «Analizar con reglas».', 'Cambia el impacto o la urgencia y elige «Guardar ticket». Abre «No puedo ingresar al CRM» en Tickets para comparar la propuesta original con la prioridad actual.', 'En «Revisar triaje», guarda un nuevo ajuste con un motivo ficticio. Recarga y abre el ticket para comprobar el historial.'], 'La demo pública usa reglas locales e identifica el origen de la propuesta. El recorrido usa datos ficticios.'],
    en: ['From a triage suggestion to a verifiable decision', 'I built a help desk that keeps the original analysis alongside the priority chosen by a person. Each revision leaves a reason in the activity log.', 'The server issues a temporary analysis reference tied to the ticket input and visitor workspace. D1 keeps the original suggestion and records the before and after values for each revision.', ['In the demo, open «Nuevo ticket» (New ticket), choose «CRM» and select «Analizar con reglas» (Analyze with rules).', 'Change the impact or urgency and select «Guardar ticket» (Save ticket). Open «No puedo ingresar al CRM» under Tickets to compare the original suggestion with the current priority.', 'Under «Revisar triaje» (Review triage), save a new adjustment with a fictional reason. Reload and reopen the ticket to check the activity log.'], 'The public demo uses local rules and identifies the source of each suggestion. The walkthrough uses fictional data.'],
    code: 'https://github.com/Gecko2087/helpdesk-ia/tree/migrar-demo-cloudflare',
    image: {
      src: 'project-helpdesk-proposal.webp', width: 996, height: 472,
      es: 'Detalle de HelpDesk IA con la propuesta original de reglas locales y la prioridad corregida de Alta a Crítica',
      en: 'HelpDesk IA ticket detail showing the original suggestion from local rules and the revised priority from High to Critical',
    },
  },
  gamerhub: {
    es: ['Un catálogo, favoritos por perfil', 'Construí una aplicación para explorar el catálogo de FreeToGame y guardar una lista de juegos por perfil.', 'La demo separa la sesión temporal del visitante y los favoritos de cada perfil. El catálogo se consulta mediante la API del servidor.', ['Entra como visitante.', 'Busca un juego y añádelo a favoritos.', 'Cambia de perfil y vuelve al anterior para comprobar la lista.'], 'El catálogo usa datos de FreeToGame. Los perfiles de la demo son temporales.'],
    en: ['One game catalog, separate favorites for each profile', 'I built an app for exploring the FreeToGame catalog and keeping a separate list of games for each profile.', 'The demo scopes favorites to a profile within a temporary visitor session. It fetches the catalog through the server API.', ['Enter as a guest.', 'Find a game and add it to your favorites.', 'Switch profiles, then return to the first one to check its list.'], 'The catalog uses FreeToGame data. Demo profiles are temporary.'],
    backend: 'https://github.com/Gecko2087/gamerhub-backend',
  },
  passforge: {
    es: ['Generación de claves en el navegador', 'Construí un generador con controles de longitud y caracteres para experimentar con ejemplos.', 'Web Crypto genera los valores en el navegador. La demo separa los registros por sesión.', ['Ajusta la longitud y los caracteres.', 'Genera un ejemplo y cópialo.', 'Usa datos inventados si exploras los registros de la demo.'], 'Demo educativa con datos ficticios.'],
    en: ['Password generation in the browser', 'I built a generator with length and character controls for experimenting with sample passwords.', 'Web Crypto generates values in the browser. The demo keeps saved entries separate by session.', ['Set the length and character options.', 'Generate and copy a sample.', 'Use fictional data if you explore saved entries.'], 'Educational demo with fictional data.'],
  },
  taskapi: {
    es: ['Permisos de tareas por rol', 'Construí una API Laravel y un tablero Vue para gestionar tareas con permisos diferentes para administradores y empleados.', 'El backend usa Sanctum y middleware de roles. El laboratorio público ilustra los recorridos con respuestas simuladas.', ['Abre el laboratorio y elige un rol.', 'Explora las acciones que muestra el tablero.', 'Consulta la implementación Laravel en el repositorio.'], 'Laboratorio público simulado. El repositorio contiene el backend.'],
    en: ['Task permissions by role', 'I built a Laravel API and a Vue dashboard for managing tasks with separate permissions for administrators and employees.', 'The backend uses Sanctum and role middleware. The public lab illustrates those workflows with simulated responses.', ['Open the lab and choose a role.', 'Explore the actions available in the dashboard.', 'See the Laravel implementation in the repository.'], 'Simulated public lab. The repository contains the backend.'],
  },
};

export const caseKeys = Object.keys(cases);
export const casePath = (lang, key) => (lang === 'en' ? '/en/projects/' : '/proyectos/') + key;

export function getCase(lang, key) {
  const project = content[lang].projects.find(item => item.key === key);
  const { code, image, backend } = cases[key];
  const [headline, intro, decision, steps, mode] = cases[key][lang];
  return { ...project, headline, intro, decision, steps, mode, backend, code: code ?? project.code,
    image: image ? { src: image.src, width: image.width, height: image.height, alt: image[lang] } : project.image,
  };
}

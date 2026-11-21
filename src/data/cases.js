import content from './content.json';

const cases = {
  helpdesk: {
    es: ['De un incidente a un historial verificable', 'Construí una mesa de ayuda para registrar incidentes, revisar el análisis sugerido y dar seguimiento a la resolución.', 'Cada visitante obtiene un espacio temporal. Cloudflare Workers valida la sesión y D1 guarda el estado y su evento en una sola operación.', ['Abre la demo y entra en Tickets.', 'Abre «Impresora de prueba no responde» y cambia el estado.', 'Reabre el ticket y comprueba que el cambio aparece en el historial.'], 'El análisis muestra el proveedor que respondió. La demo puede usar reglas locales.'],
    en: ['From a support incident to an audit trail', 'I built a help desk to log incidents, review suggested analyses and track their resolution.', 'Each visitor gets a temporary workspace. Cloudflare Workers checks the session and D1 saves the state change and its event together.', ['Open the demo and go to Tickets.', 'Open the sample printer ticket and change its status.', 'Reopen the ticket and check that the change appears in its activity log.'], 'Each analysis identifies its provider. The demo can use local rules.'],
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
  const [headline, intro, decision, steps, mode] = cases[key][lang];
  return { ...project, headline, intro, decision, steps, mode, backend: cases[key].backend };
}

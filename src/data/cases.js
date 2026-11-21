import content from './content.json';

const cases = {
  helpdesk: {
    es: ['De un incidente a un historial verificable', 'Construí una mesa de ayuda para registrar incidentes y revisar su triaje. Cada corrección de impacto o urgencia deja un motivo visible en el historial.', 'Cloudflare Workers valida el espacio temporal de cada visitante. D1 guarda la prioridad recalculada y su evento en una sola operación. Repetir los mismos valores evita duplicar el evento.', ['Abre la demo y entra en Tickets.', 'Abre «Impresora de prueba no responde». En «Revisar triaje», cambia impacto y urgencia a Alto y escribe un motivo ficticio.', 'Guarda el triaje. La prioridad pasa de Media a Crítica y el historial conserva el motivo tras recargar.'], 'El análisis muestra el proveedor que respondió. El recorrido de triaje funciona con datos ficticios.'],
    en: ['From a support incident to an audit trail', 'I built a help desk for logging incidents and reviewing triage decisions. Changes to impact or urgency leave a reason in the activity log.', 'Cloudflare Workers checks each visitor’s temporary workspace. D1 saves the recalculated priority and its event together. Submitting the same values again avoids a duplicate event.', ['Open the demo and go to Tickets.', 'Open «Impresora de prueba no responde». Under «Revisar triaje», set impact and urgency to Alto (High) and enter a fictional reason.', 'Select «Guardar triaje». The priority changes from Medium to Critical, and the activity log retains your reason after reload.'], 'Each analysis identifies its provider. The triage walkthrough uses fictional data.'],
    code: 'https://github.com/Gecko2087/helpdesk-ia/tree/migrar-demo-cloudflare',
    image: {
      src: 'project-helpdesk-triage.webp', width: 952, height: 475,
      es: 'Detalle de HelpDesk IA con los controles de triaje y su cambio de prioridad registrado',
      en: 'HelpDesk IA ticket detail showing triage controls and the recorded priority change',
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

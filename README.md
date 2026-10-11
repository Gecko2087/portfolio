# Lucas Nieto · Portfolio

[Español](https://gecko2087.github.io/portfolio/) · [English](https://gecko2087.github.io/portfolio/en.html)

Portfolio de desarrollo full stack, IA aplicada, automatización y datos. La interfaz conecta mi experiencia en operación con escenarios interactivos de atención, reportes e integraciones. Los escenarios y las vistas de proyectos usan datos ficticios y explican sus límites.

HTML semántico, CSS adaptable y JavaScript sin dependencias de producción. Incluye movimiento reducido, navegación por teclado, CV imprimible y casos de HelpDesk IA, PassForge, GamerHub y Task API. La disponibilidad de los backends originales debe comprobarse por separado de las demos estáticas.

## De la idea. A la experiencia.

Diseño desarrollado con Google Stitch y adaptado a la implementación del portfolio: sistema Obsidian Terminal, carbón mate, acentos menta/cian, Plus Jakarta Sans, Inter y JetBrains Mono. La composición combina tipografía de gran escala, interfaces en profundidad y escenas de proyecto con identidad propia. El contenido técnico de la generación se revisó y se reemplazaron las métricas y afirmaciones no verificadas por los hechos de los proyectos.

El banco de interfaces de la portada incluye cuatro acciones locales: cambiar la prioridad de un ticket, mostrar un registro ficticio, marcar un juego de muestra como favorito y completar/reiniciar tareas. Un recorrido interactivo conecta idea, interfaz, API y persistencia. Los estados viven en memoria y no envían datos ni se presentan como llamadas a los backends originales.

`immersive.css`, `stitch.css`, `immersive.js` y `stitch.js` se aplican a las páginas ES/EN del portfolio. El movimiento puede pausarse y respeta las preferencias del sistema. Los controles admiten teclado, los filtros ocultan los proyectos correspondientes y los casos técnicos devuelven el foco al control que los abrió. Las demos, el CV y el transporte de contacto conservan sus implementaciones independientes.

## Contacto propio

El formulario ES/EN utiliza una [API Node en Vercel](https://github.com/Gecko2087/portfolio-contact-api), con validación de campos, destinatario fijo, peticiones HMAC hacia Google MailApp, límites persistentes y prevención de envíos duplicados. Las claves y la autorización de correo permanecen en los servidores. Google recibe únicamente permiso para enviar correo, sin acceso a leer la bandeja. No utiliza Formspree.

GitHub Pages publica estos archivos estáticos desde `main`; no ejecuta la API. Los servicios gratuitos tienen cuotas y pueden sufrir interrupciones. La confirmación del formulario significa que Google aceptó el envío, no que el destinatario lo haya leído.

## Mantenimiento

La fuente y los scripts de generación se mantienen en el proyecto local. Regenerar las versiones ES/EN y validar enlaces y recursos antes de publicar. No incorporar credenciales, datos reales de clientes ni archivos privados al repositorio.

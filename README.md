# Lucas Nieto · Portfolio

[Español](https://gecko2087.github.io/portfolio/) · [English](https://gecko2087.github.io/portfolio/en.html)

Portfolio de desarrollo full stack, IA aplicada, automatización y datos. La interfaz conecta mi experiencia en operación con escenarios interactivos de atención, reportes e integraciones. Los escenarios y las vistas de proyectos usan datos ficticios y explican sus límites.

HTML semántico, CSS adaptable y JavaScript sin dependencias de producción. Incluye movimiento reducido, navegación por teclado, CV imprimible y casos de HelpDesk IA, PassForge, GamerHub y Task API. La disponibilidad de los backends originales debe comprobarse por separado de las demos estáticas.

## Código con contexto

Identidad editorial propia: papel, tinta y acento rojizo; diagrama SVG de personas, datos y servicios; archivo de proyectos con notas sobre qué revisar. El recorrido por perfil abre directamente el caso técnico relevante y devuelve el foco al atajo al cerrar. La implementación real del contacto se presenta como un caso adicional con código público, separado de las simulaciones.

`atelier.css` y `atelier.js` se aplican solo a las páginas del portfolio. Las versiones ES/EN comparten estructura y comportamiento; el generador conserva las versiones de recursos en sus URLs. Se revisaron móvil de 320 y 390 px, filtros, casos, Escape y el formulario sin enviar nuevos correos.

## Contacto propio

El formulario ES/EN utiliza una [API Node en Vercel](https://github.com/Gecko2087/portfolio-contact-api), con validación de campos, destinatario fijo, peticiones HMAC hacia Google MailApp, límites persistentes y prevención de envíos duplicados. Las claves y la autorización de correo permanecen en los servidores. Google recibe únicamente permiso para enviar correo, sin acceso a leer la bandeja. No utiliza Formspree.

GitHub Pages publica estos archivos estáticos desde `main`; no ejecuta la API. Los servicios gratuitos tienen cuotas y pueden sufrir interrupciones. La confirmación del formulario significa que Google aceptó el envío, no que el destinatario lo haya leído.

## Mantenimiento

La fuente y los scripts de generación se mantienen en el proyecto local. Regenerar las versiones ES/EN y validar enlaces y recursos antes de publicar. No incorporar credenciales, datos reales de clientes ni archivos privados al repositorio.

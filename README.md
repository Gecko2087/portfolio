# Lucas Nieto · Portfolio

[Español](https://lucas-nieto-portfolio.portfolio-lucas-nieto.workers.dev/) · [English](https://lucas-nieto-portfolio.portfolio-lucas-nieto.workers.dev/en.html)

El portfolio se publica como archivos estáticos en Cloudflare Workers. La copia de GitHub Pages se publica desde main.

- [HelpDesk IA](https://helpdesk-ia-demo.portfolio-lucas-nieto.workers.dev/) guarda tickets, categorías y su historial en D1. Los espacios ficticios son privados y expiran después de una hora. El análisis usa reglas hasta que se configure el secreto `GEMINI_API_KEY` en el Worker de HelpDesk.
- [PassForge](https://passforge-demo.portfolio-lucas-nieto.workers.dev/) utiliza Web Crypto y D1 en sesiones temporales. Usar solo datos ficticios.
- [GamerHub](https://gamerhub-demo.portfolio-lucas-nieto.workers.dev/login) utiliza el catálogo de FreeToGame y guarda perfiles y favoritos en D1.
- [Task API](https://lucas-nieto-portfolio.portfolio-lucas-nieto.workers.dev/lab.html?project=taskapi) es una vista interactiva que simula la API y se publica junto al portfolio.

El formulario envía mensajes a través de un Worker de Cloudflare y Google MailApp. Las credenciales se administran como secretos del servidor.

Ejecutar `npm run check` para validar recursos e idiomas y `npm run deploy:cloudflare` para compilar y publicar los archivos versionados.

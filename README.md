# Lucas Nieto · Portfolio

[Español](https://lucas-nieto-portfolio.portfolio-lucas-nieto.workers.dev/) · [English](https://lucas-nieto-portfolio.portfolio-lucas-nieto.workers.dev/en.html)

La portada usa Astro, Tailwind CSS, GSAP con ScrollTrigger y una escena de Three.js cargada bajo demanda. Cloudflare Workers publica la salida estática. GitHub Pages conserva la portada HTML anterior.

- [HelpDesk IA](https://helpdesk-ia-demo.portfolio-lucas-nieto.workers.dev/) guarda tickets, categorías y su historial en D1. Los espacios ficticios son privados y expiran después de una hora. El análisis usa reglas hasta que se configure el secreto `GEMINI_API_KEY` en el Worker de HelpDesk.
- [PassForge](https://passforge-demo.portfolio-lucas-nieto.workers.dev/) utiliza Web Crypto y D1 en sesiones temporales. Usar solo datos ficticios.
- [GamerHub](https://gamerhub-demo.portfolio-lucas-nieto.workers.dev/login) utiliza el catálogo de FreeToGame y guarda perfiles y favoritos en D1.
- [Task API](https://lucas-nieto-portfolio.portfolio-lucas-nieto.workers.dev/lab.html?project=taskapi) es una vista interactiva que simula la API y se publica junto al portfolio.

El formulario envía mensajes a través de un Worker de Cloudflare y Google MailApp. Las credenciales se administran como secretos del servidor.

Usar Node 22.23.4 o posterior y ejecutar `npm ci`. `npm run check` compila y verifica los recursos e idiomas. Para revisar el resultado junto con CV y laboratorio, ejecutar `npm run preview` después de compilar. `npm run deploy:cloudflare` compila y publica.

La versión previa a Astro corresponde al commit `b16aa52` y a la versión de Cloudflare `09963d91-7779-40b9-822f-f39ba1068925`. Cloudflare puede restaurar esa versión mientras conserve el despliegue. El historial de Git permite reconstruirla después.

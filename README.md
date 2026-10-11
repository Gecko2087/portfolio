# Lucas Nieto · Portfolio

[Español](https://gecko2087.github.io/portfolio/) · [English](https://gecko2087.github.io/portfolio/en.html)

Portfolio full stack. Tres proyectos destacados se pueden explorar desde la primera pantalla: HelpDesk IA, PassForge y GamerHub. Task API completa la selección técnica. Experiencia, CV y contacto se presentan en secciones breves.

## Diseño y accesibilidad

Composición Project Cinema desarrollada con Google Stitch y adaptada a proyectos reales: tipografía de gran escala, fondo oscuro, luz violeta y capturas auténticas de las demos en español e inglés. Sin métricas inventadas ni interfaces de clientes. HTML semántico, CSS adaptable y JavaScript sin dependencias de producción.

cinema.css y cinema.js implementan la portada. Los selectores admiten flechas, Inicio y Fin; los diálogos devuelven el foco al control que los abrió. El movimiento puede pausarse y respeta la preferencia del sistema. El CV es imprimible.

## Demos públicas

Son aplicaciones independientes ejecutadas en el navegador con datos ficticios y estados temporales. No prueban la disponibilidad de los backends originales.

- HelpDesk: reglas locales, creación y resolución de tickets. Esta demo no llama a Gemini.
- PassForge: generación real con Web Crypto, copia y bóveda ficticia sin autenticación ni persistencia. No introducir contraseñas personales.
- GamerHub: catálogo ficticio, filtros, detalles y favoritos locales.
- Task API: tablero por roles y respuestas de API simuladas.

Los repositorios enlazados contienen las implementaciones originales con servidor y persistencia. Su disponibilidad debe comprobarse por separado.

## Contacto propio

El formulario utiliza una [API Node en Vercel](https://github.com/Gecko2087/portfolio-contact-api), validación, destinatario fijo, HMAC hacia Google MailApp, límites persistentes y prevención de duplicados. Claves y autorización permanecen en servidores. No utiliza Formspree. La confirmación significa que Google aceptó el envío; no confirma su lectura.

GitHub Pages publica los archivos estáticos desde main. Los servicios gratuitos tienen cuotas y pueden sufrir interrupciones.

## Mantenimiento

Regenerar ES/EN y validar enlaces y recursos antes de publicar. Publicar solamente archivos del sitio: nunca credenciales, datos de clientes ni archivos privados del workspace.

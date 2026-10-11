# Lucas Nieto · Portfolio

[Español](https://gecko2087.github.io/portfolio/) · [English](https://gecko2087.github.io/portfolio/en.html)

Portfolio full stack. Tres proyectos destacados se pueden explorar desde la primera pantalla: HelpDesk IA, PassForge y GamerHub. Task API completa la selección técnica. Experiencia, CV y contacto se presentan en secciones breves.

## Diseño y accesibilidad

Composición Project Cinema desarrollada con Google Stitch y adaptada a proyectos reales: tipografía de gran escala, fondo oscuro, luz violeta y capturas auténticas de las demos en español e inglés. Sin métricas inventadas ni interfaces de clientes. HTML semántico, CSS adaptable y JavaScript sin dependencias de producción.

cinema.css y cinema.js implementan la portada. Los selectores admiten flechas, Inicio y Fin; los diálogos devuelven el foco al control que los abrió. El movimiento puede pausarse y respeta la preferencia del sistema. El CV es imprimible.

## Demos públicas

HelpDesk abre la aplicación original desplegada. PassForge, GamerHub y Task API continúan como labs independientes ejecutados en el navegador con datos ficticios y estados temporales.

- HelpDesk: interfaz React conectada a una API Express y PostgreSQL reales. Cada visitante obtiene un espacio aislado con datos ficticios que vence después de una hora. El análisis usa Gemini 3.5 Flash Lite cuando el proveedor está disponible y reglas locales como respaldo. La API aplica límites de uso y la interfaz pública está actualmente en español.
- PassForge: generación real con Web Crypto, copia y bóveda ficticia sin autenticación ni persistencia. No introducir contraseñas personales.
- GamerHub: catálogo ficticio, filtros, detalles y favoritos locales.
- Task API: tablero por roles y respuestas de API simuladas.

La disponibilidad de los servicios externos puede variar. El código del servidor mantiene claves y credenciales fuera del cliente y del repositorio público; nunca deben incorporarse secretos a los archivos estáticos del portfolio.

## Contacto propio

El formulario utiliza una [API Node en Vercel](https://github.com/Gecko2087/portfolio-contact-api), validación, destinatario fijo, HMAC hacia Google MailApp, límites persistentes y prevención de duplicados. Claves y autorización permanecen en servidores. No utiliza Formspree. La confirmación significa que Google aceptó el envío; no confirma su lectura.

GitHub Pages publica los archivos estáticos desde main. Los servicios gratuitos tienen cuotas y pueden sufrir interrupciones.

## Mantenimiento

Regenerar ES/EN y validar enlaces y recursos antes de publicar. Publicar solamente archivos del sitio: nunca credenciales, datos de clientes ni archivos privados del workspace.

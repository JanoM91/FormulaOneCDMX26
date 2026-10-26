# Continuidad del proyecto — México 26

## Objetivo y estado
PWA móvil en español para disfrutar el GP de México 2026 en grupo, con agenda oficial, datos deportivos, información práctica y viaje del jueves 29-oct al domingo 1-nov. Prioridad: experiencia móvil clara y agradable, Vercel principalmente; no se necesita Supabase.

Repositorio: https://github.com/JanoM91/FormulaOneCDMX26
Rama: feat/mexico-gp-companion
PR: https://github.com/JanoM91/FormulaOneCDMX26/pull/1 (no fusionar sin indicación del propietario)
Producción: https://formula-one-cdmx26.vercel.app

Next.js 16.4.3, React 19.3.1, TypeScript, CSS/Tailwind 4, Zod. Node 24. `npm ci`, `npm test`, `npm run build`, `npm start`. Se usa Webpack porque Turbopack falló en este entorno. No introducir backend de usuarios para datos que deben quedarse en el teléfono.

## Arquitectura
- `src/components/companion.tsx`: navegación por hash, inicio, agenda, pilotos, mapa, guía, ajustes, importación de asientos.
- `src/components/travel.tsx`: viaje, importación de viajeros, asignación de cuartos, check-in, rutas, lugares.
- `src/components/hooks.ts`: persistencia local y consulta de datos con caché/reintentos.
- `src/lib/preferences.ts`: esquema Zod; `trip` tiene default para migrar datos existentes sin perder asientos/notas.
- `src/lib/travel.ts`: hotel, URLs públicas de Maps, recomendaciones y fuentes.
- `src/lib/providers.ts`: OpenF1 autenticado desde servidor, Jolpica y Open-Meteo.
- `src/components/timing.tsx`: tabla y demo explícita, nunca mezcla datos simulados con reales.
- `src/app/globals.css`: diseño responsivo inspirado en cartel; tema paddock ahora México 2026. Barlow Condensed autoalojada (OFL).
- `public/sw.js`: shell, póster, fuente y archivos estáticos para fallback offline. Incrementar versión si cambia la shell.

## Privacidad
Repositorio público. NUNCA incluir nombres del grupo, números de cuarto, asientos, reserva, capturas de reserva ni credenciales en código, commits, URLs públicas o este documento. Los archivos personales están en `.private/` (ignorado). Importación JSON procesada en navegador; clave `gp-preferences-v1`. Campos personales no viajan al servidor ni a Maps. La distribución de viajeros se encuentra únicamente en `.private/nuestro-viaje.json`; asientos en `.private/nuestros-asientos.json`. El usuario debe transferir esos archivos por un medio privado e importarlos en cada teléfono. Los cuartos se capturan al check-in, no inventarlos. Borrar datos de ajustes también borra viaje.

## Servicios y despliegue
Proyecto Vercel `formula-one-cdmx26`, ID `prj_3zwf6wtjbWDCaWqAIAq1QN2QGoK7`, cuenta `jano-s-portfolio`. GitHub conectado. `OPENF1_USERNAME` y `OPENF1_PASSWORD` ya configurados como secretos en producción. NO pedirlos en chat, imprimirlos ni copiarlos al cliente. El proveedor obtiene/renueva token; consulta cada 30 segundos con caché. Los siguientes pushes de la rama crean preview; para producción desplegar explícitamente el commit probado con target production. No asumir que preview posee los secretos de producción. Confirmar READY y SHA, comprobar dominio público. El conector de acceso protegido dio 403 propio; el dominio público funciona sin alterar seguridad.

## Datos y límites
Agenda F1 México 30-oct a 1-nov, hora CDMX. Hospedaje de referencia Hotel Beverly, Nueva York 301, Nápoles. Check-in 29-oct desde 15:00; check-out 1-nov 12:00, por captura aportada por usuario. Recordar salida y consigna antes de ir a la carrera; consigna NO confirmada automáticamente. Sábado Boxes Oro Sur/Puerta 2 según indicación del usuario, requiere confirmar organizador; viernes Puerta 9 y domingo Puerta 13.

OpenF1 responde, pero directo de México solo puede probarse durante una sesión iniciada. No afirmar que se observó una carrera en vivo. No se integró streaming, telemetría coche por coche ni feed automático de noticias. Jolpica puede asociar sustitutos de temporada; la app lo aclara. Maps calcula rutas dinámicas al abrir; guía no representa estado de transporte en vivo. No se reserva restaurante ni se pide Uber. Horarios de cocina y partidos deben confirmarse con cada lugar.

## Verificación y continuidad
Ver `docs/VERIFICATION.md` para evidencia real y límites. Tests de migración de preferencias, validación/importación, URLs y proveedores. Probar viaje en 390px: importación, asignación individual/compartida, persistencia tras recarga, check-in y consigna, mapa del sábado, alto contraste y ausencia de desbordamiento. No confundir respuesta HTTP 200 de timing "Próximo" con datos en vivo.

El usuario puede aportar origen de llegada y equipos/ligas favoritos; si aún falta, las rutas al hotel permiten seleccionar origen y no se inventa cartelera. Mantener recomendaciones documentadas. Priorizar mejoras visuales con prueba en navegador; no sustituir contenido real por maquetas.

## Prompt para continuar
Lee este documento, README y docs/VERIFICATION.md. Inspecciona `git status` y los últimos commits antes de editar. Conserva cambios existentes y privacidad. Continúa según la nueva instrucción del propietario, prueba el flujo afectado y publica solo código/recursos públicos. Nunca uses los archivos `.private` como recursos web. Informa con precisión qué quedó probado y qué sigue pendiente.

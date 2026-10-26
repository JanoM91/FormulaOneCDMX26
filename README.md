# México 26 · Nuestro fin de semana

Guía móvil en español para el GP de Ciudad de México, 30 de octubre–1 de noviembre de 2026. Next.js App Router, React, TypeScript, Tailwind CSS y Vercel. Sin base de datos ni cuentas: asientos, notas, checklist y preferencias permanecen en cada dispositivo.

## Ejecutar

Requiere Node.js 24 y npm. `npm ci`, `npm test`, `npm run build`, `npm start`. Para desarrollo: `npm run dev`. El compilador Webpack evita las restricciones de creación de procesos de Turbopack en algunos entornos locales.

El sitio funciona sin credenciales. Para el timing en vivo, configurar `OPENF1_USERNAME` y `OPENF1_PASSWORD` como **Secret**, sin prefijo `NEXT_PUBLIC_`, en Vercel (Preview y/o Production). Copiar `.env.example` a `.env.local` solo para credenciales propias de desarrollo. Nunca publicar secretos. Después de modificar variables de Vercel, crear un nuevo deployment.

## Funcionalidad

- Inicio con próxima actividad, clima y selección editorial de avisos.
- Agenda completa de tres días en `America/Mexico_City`, con explicaciones y accesos personalizados.
- Asientos mediante formulario o importación JSON local; compartir por WhatsApp abre el selector del usuario.
- Notas, checklist por día, favorito, punto de encuentro y borrado de datos personales.
- Live timing OpenF1 con origen, fecha, antigüedad, filtros, Race Control y demo separada.
- Clasificación Jolpica y alineación oficial de respaldo sin puntos inventados.
- Mapa OSM del entorno bajo demanda, enlaces al mapa oficial de servicios e indicaciones externas.
- PWA con manifest, iconos PNG y caché de shell + assets. Últimas respuestas válidas en el dispositivo.
- Alto contraste, lectura fácil, movimiento reducido y tres temas visuales.

## Datos privados

`.private/` está excluido del repositorio. El archivo de asientos de la familia se entrega separadamente, no se distribuye con la web. En cada teléfono: Ajustes → Configurar asientos → Importar archivo privado. El importador acepta únicamente `day`, `section`, `row`, `seats`; descarta campos desconocidos. No hay endpoints para subir información personal.

Formato admitido: `{"tickets":[{"day":"friday","section":"A","row":"1","seats":"1, 2"}]}`. Valores de día: `friday`, `saturday`, `sunday`. No agregar QR ni datos de Ticketmaster.

## Proveedores y comportamiento de fallos

| Proveedor               | Implementación                                                                           | Actualización                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| OfficialF1Provider      | Agenda editorial contrastada con horario oficial                                         | Cambiar `src/lib/content.ts` y desplegar                               |
| MexicoGPProvider        | Enlaces oficiales de accesos, mapa y seguridad                                           | Revisión editorial                                                     |
| FIAProvider             | Enlace a documentos oficiales; sin scraping                                              | Consulta externa                                                       |
| OpenF1Provider          | Sesiones 2026 México, pilotos, posición, vueltas, intervalos, stints, pits, Race Control | Polling cliente 30 s; caché Next/CDN 30 s; espera creciente ante error |
| FallbackResultsProvider | Jolpica para clasificación; alineación oficial si falla                                  | Caché 15 min                                                           |
| Open-Meteo              | Estimación actual y pronóstico 7 días cerca del circuito                                 | Caché 10 min                                                           |

La selección de sesión se restringe a México 2026. Antes del evento no se presenta Austin ni otra carrera como México. Los datos con más de 90 segundos pierden la etiqueta “En vivo”. Un fallo no reemplaza los datos reales por la demo. Los horarios no demuestran que una sesión se haya iniciado: el estado de agenda dice “En horario”.

Las credenciales OpenF1 se intercambian por un token en el servidor, con renovación según su vencimiento. Las llamadas REST están espaciadas y usan caché. Esta versión familiar consulta cada 30 segundos; no proporciona telemetría de baja latencia ni garantiza inmediatez. La caché en memoria del token no se comparte entre instancias Vercel. Revisar cuota del plan antes de abrir el sitio a una audiencia masiva.

## Offline

Abrir la web una vez con conexión y esperar “Base offline preparada”. El service worker precarga la shell y sus archivos JS/CSS; la navegación usa fragmentos para que las seis secciones funcionen con la misma shell. Ver cada integración al menos una vez para conservar su última respuesta. Los mapas externos y compartir por WhatsApp necesitan conexión. No se descarga el mapa completo del recinto. La caché personal no se sincroniza entre navegadores.

Para publicar una nueva versión del shell, incrementar el nombre `CACHE` de `public/sw.js`. Las nuevas instalaciones precargan todos los assets referenciados por la página. Las respuestas API no se cachean en el service worker: el cliente conserva únicamente la última respuesta exitosa y muestra su antigüedad.

## Operación del evento

Ver [plan y criterios](docs/PLAN.md), [fuentes](docs/SOURCES.md) y [verificación](docs/VERIFICATION.md). Noticias y cambios de transporte son selección editorial, no un agregador automático. Para un cambio urgente, actualizar contenido, fecha y enlace original, verificar, y desplegar.

La Puerta 2 del sábado proviene de la indicación personal del boleto. La página general del organizador indica Puerta 1 para otras localidades grises. El sitio muestra la discrepancia y pide confirmar el acceso específico de Boxes Oro Sur. No se inventan coordenadas de puertas, rutas interiores ni tiempos de caminata.

## Despliegue

Proyecto Vercel: `formula-one-cdmx26`, conectado a `JanoM91/FormulaOneCDMX26`. Framework Next.js, Node 24, comando `npm run build`, región de funciones `iad1`. Vercel maneja HTTPS. Usar la rama de PR para preview; promover a producción únicamente después de revisar el resultado. La protección de acceso de Vercel se conserva.

## Límites conocidos

El directo requiere una suscripción OpenF1 válida y una sesión activa; no se puede certificar el directo del evento antes de su comienzo. No hay API oficial pública integrada de F1/FIA/MéxicoGP: esos adaptadores son snapshots editoriales o enlaces. Fotos de pilotos no incluidas por falta de licencia verificada. Estadísticas avanzadas (podios, tendencias, historia completa de equipos) y servicios georreferenciados interiores no se presentan sin fuentes confirmadas. La geolocalización es puntual, no seguimiento del grupo. Los mensajes de Race Control se conservan en su idioma original.

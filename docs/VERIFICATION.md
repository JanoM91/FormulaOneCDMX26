# Verificación

## Pruebas automatizadas

`npm test`: 18 casos sobre agenda completa, zona horaria, medianoche CDMX, fin del evento, ausencia de falsos estados en vivo, antigüedad, importación privada, valores nulos, registros desordenados, diferencia cero con líder, formato de vueltas/diferencias, proveedor antes de México, esquemas inválidos, agregación histórica, fallback de clasificación, clasificación de constructores, demo y fecha meteorológica.

Las pruebas de integración de proveedores usan respuestas HTTP controladas. Verifican transformación y contrato; no certifican la suscripción ni el directo futuro.

## Conectividad de fuentes

26 octubre: OpenF1 sesiones México 2026, Jolpica clasificación 2026 y Open-Meteo devolvieron HTTP 200 en una consulta real. El propietario configuró las dos variables OpenF1 como Secret en producción. No se capturan ni publican sus valores.

Vercel desplegó automáticamente la rama de implementación en `https://formula-one-cdmx26.vercel.app` con estado READY. En el dominio alojado se confirmó HTTP 200 de timing (sin sesión iniciada), 11 constructores y clima. El navegador mostró la aplicación, el pronóstico y la clasificación de constructores. El conector de inspección protegido devolvió 403 por permisos propios, pero el acceso público normal respondió correctamente.

## Checklist de navegador

- Probado en navegador integrado a 390 × 844 y a su tamaño habitual: las seis secciones abren, el sábado muestra Puerta 2 y la advertencia correspondiente.
- Se guardaron asientos de prueba, una nota y un elemento de checklist. Persistieron tras recargar.
- Demo claramente etiquetada; el filtro “a menos de 1 segundo” mostró únicamente el piloto con intervalo 0.7 s del fixture.
- Clasificación Jolpica y clima Open-Meteo visibles con fuente, ronda/fecha. Consola sin errores antes de interrumpir deliberadamente el servidor.
- Servidor local apagado: recarga exitosa desde service worker, apertura de las seis secciones, nota conservada y clima previo con aviso de fallo de actualización.
- La caída de servidor demuestra fallback offline de la shell; no se cambió la conectividad del sistema ni se simuló un dispositivo físico en modo avión.
- Se corrigieron los decimales excesivos de las diferencias y los mensajes de error del navegador en inglés.

## Límites de la verificación

No se ha presenciado una sesión en vivo del GP de México 2026 (aún no comienza). PWA y geolocalización requieren contexto seguro. Pruebas locales de navegador no equivalen a una auditoría formal WCAG ni una instalación en cada modelo de teléfono. Mapas externos y mensajería dependen de servicios de terceros.

## Actualización de viaje y diseño — 26 octubre 2026

22 pruebas aprobadas: se añaden migración de preferencias antiguas sin perder asientos/notas, importación de viajeros y cuartos con descarte de campos ajenos, rechazo de datos inválidos y URLs de Maps sin datos personales. Compilación de producción y TypeScript aprobados.

Navegador sobre compilación de producción local a 390 × 844: captura manual de los tres viajeros; habitación individual y compartida correctas; números de cuarto de prueba y check-in persistieron tras recarga. Los números ficticios y la marca de check-in se retiraron después. Ruta de sábado cambia al acceso del Palacio de los Deportes. Hotel y horarios legibles; sin desbordamiento horizontal (390/390), consola sin errores; alto contraste revisado visualmente. El selector nativo de archivos se interrumpió durante la prueba, por lo que la importación JSON se verifica por pruebas de esquema, no se afirma que se completó el selector en navegador.

La versión de desarrollo detenida durante la interrupción sirvió una shell de caché sin hidratar correctamente; la verificación final se hizo con una compilación de producción y un origen local limpio. El póster y la tipografía están incluidos en la lista de recursos offline. Nombres reales, cuartos y archivos privados quedan excluidos del commit. La captura de reserva tampoco se publica. Documento de continuidad: docs/CLAUDE-HANDOFF.md.

## Pulido móvil, imágenes y llegada en auto — 27 octubre 2026

25 pruebas aprobadas (nuevas: migración del plan de manejo, validación de parada, ruta con punto intermedio). TypeScript y compilación de producción aprobados.

Compilación local a 390 × 844 (Playwright, tema México 2026, claro/oscuro, alto contraste y temas alternos): sin desbordamiento horizontal en las 7 secciones (antes Inicio medía 646 px); títulos y pestañas antes invisibles ahora legibles; 25 imágenes cargan sin errores; créditos visibles en Guía. Archivo de viaje anonimizado importado: ruta Maps con origen, parada y hotel; persistencia tras recarga. No se probó en un teléfono físico ni en la preview de Vercel desde este entorno.

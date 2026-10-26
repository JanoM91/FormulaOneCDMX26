# Verificación

## Pruebas automatizadas

`npm test`: 18 casos sobre agenda completa, zona horaria, medianoche CDMX, fin del evento, ausencia de falsos estados en vivo, antigüedad, importación privada, valores nulos, registros desordenados, diferencia cero con líder, formato de vueltas/diferencias, proveedor antes de México, esquemas inválidos, agregación histórica, fallback de clasificación, clasificación de constructores, demo y fecha meteorológica.

Las pruebas de integración de proveedores usan respuestas HTTP controladas. Verifican transformación y contrato; no certifican la suscripción ni el directo futuro.

## Conectividad de fuentes

26 octubre: OpenF1 sesiones México 2026, Jolpica clasificación 2026 y Open-Meteo devolvieron HTTP 200 en una consulta real. Credenciales OpenF1 pendientes de configuración por el propietario en Vercel. No se capturan ni publican secretos.

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

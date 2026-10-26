# Registro de fuentes

Verificadas el 26 de octubre de 2026. La agenda proporcionada coincide con el horario oficial de Formula 1. En UI se distinguen fuentes oficiales, alternativas, análisis y demo.

| Dato                                             | Fuente                                                                                                                                                     |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Horario, fechas, longitud y vueltas              | https://www.formula1.com/en/latest/article/formula-1-gran-premio-de-la-ciudad-de-mexico-2026.14b3wTWzNNLJ5Wd8cG7HCQ                                        |
| Accesos y transporte                             | https://www.mexicogp.mx/informacion/accesos/                                                                                                               |
| Mapa y servicios                                 | https://www.mexicogp.mx/mapa-de-accesos/                                                                                                                   |
| Objetos permitidos/prohibidos                    | https://www.mexicogp.mx/informacion/seguridad/                                                                                                             |
| Alineación de temporada                          | https://www.formula1.com/en/drivers y https://www.formula1.com/en/teams                                                                                    |
| Numeración vigente Norris, Verstappen y Lindblad | https://www.formula1.com/en/drivers/lando-norris · https://www.formula1.com/en/drivers/max-verstappen · https://www.formula1.com/en/drivers/arvid-lindblad |
| Terminología 2026                                | https://corp.formula1.com/f1-2026-regulations-terminology-update/                                                                                          |
| Documentos FIA                                   | https://www.fia.com/events/fia-formula-one-world-championship/season-2026                                                                                  |
| Timing independiente                             | https://openf1.org/docs/ y https://openf1.org/auth.html                                                                                                    |
| Clasificación alternativa                        | https://api.jolpi.ca/ergast/f1/2026/driverstandings/                                                                                                       |
| Clima, CC BY 4.0                                 | https://open-meteo.com/en/docs                                                                                                                             |
| Mapa de entorno                                  | https://www.openstreetmap.org/copyright                                                                                                                    |

OpenF1 devolvió las cinco sesiones de México 2026 mediante `sessions?year=2026&country_name=Mexico`. Jolpica devolvió clasificación 2026 y ronda explícita. Open-Meteo devolvió datos con zona CDMX. Ninguna de esas respuestas convierte al proveedor en oficial de F1.

La lista de noticias es una selección editorial; su fecha es la de verificación, no una fecha de publicación inventada. Las recomendaciones de llegada no son horarios oficiales ni tiempos garantizados. Los asientos proceden exclusivamente del usuario y se entregan en archivo privado.

## Viaje, hospedaje y diseño (26-oct-2026)
- Usuario: captura de reserva con Hotel Beverly, Nueva York 301, Nápoles; 29-oct desde 15:00 y salida 1-nov 12:00. No se sube la captura, titular ni habitaciones a GitHub. La categoría Suite junior se muestra como dato a confirmar para ambas habitaciones.
- Metro: https://www.metro.cdmx.gob.mx/acerca-del-metro/mas-informacion/preguntas-frecuentes y https://www.metro.cdmx.gob.mx/la-red/linea-9 . Metrobús: https://metrobus.cdmx.gob.mx/portal-ciudadano/preguntas-frecuentes , https://www.metrobus.cdmx.gob.mx/dependencia/PagoMB , https://metrobus.cdmx.gob.mx/mapas-de-sistema/mapa-linea-1/L1-estaciones . Itinerario orientativo sintetizado de la red, no consulta operativa en vivo. Tarifas Metro $5, Metrobús ordinario $6. No suponer transporte directo a cualquier puerta.
- De Costa a Costa: https://decostaacosta.mx/ . El jueves aparece con error am/pm, por eso no se reproduce como horario confirmado.
- Día Uno: https://diauno.com/ . Sin horario verificable en página, se pide confirmar.
- Twin Peaks Insurgentes: https://twinpeaksmexico.mx/sucursales/insurgentes-sur/ para ubicación/teléfono; horario de https://www.opentable.com/r/twin-peaks-mexico-ciudad-de-mexico explícitamente atribuido a directorio.
- Cantina La 20 WTC: https://cdmx365.com/es/cantina-la-20-wtc , directorio independiente. Transmisiones específicas no verificadas ni prometidas.
- Cartel MéxicoGP 2026 aportado por usuario, conservado sin modificación de imagen. La reserva privada no se incorpora como recurso. Tipografía Barlow Condensed Bold, Google Fonts: https://github.com/google/fonts/tree/main/ofl/barlowcondensed ; licencia OFL incluida en public/fonts/OFL.txt.

## Imágenes (27-oct-2026)

- Fotos de autos 2026 (un auto por piloto) y vistas aéreas del Autódromo: Wikimedia Commons, licencias CC BY 4.0 y CC BY-SA 4.0. Autor, licencia y página de origen por imagen en `src/lib/media.ts`; se muestran en Guía → Créditos de imágenes. Imágenes recortadas y reducidas a WebP.
- Trazado: `File:2022 F1 CourseLayout Mexico.svg` (CC BY-SA 4.0). Sus zonas DRS son de 2022; la app lo aclara.
- No se incluyen retratos de personas reales.

## Llegada en auto (27-oct-2026)

- Pase Turístico oficial: https://www.paseturistico.cdmx.gob.mx/ y ficha de trámite https://www.cdmx.gob.mx/public/InformacionTramite.xhtml?faces-redirect=true&idTramite=98 (vigencias 3/7/14 días, Llave CDMX, sin validez en contingencia; resumen de Fox Sports MX, 23-may-2026).
- Hoy No Circula para placas de otros estados (5:00–11:00 entre semana, día por placa, sábados): Motorpasión MX, oct-2025; consulta oficial https://hoynocircula.cdmx.gob.mx/.
- Valet sin costo del hotel: listado de Kayak; pendiente de confirmar con el hotel.
- La parada personal del viaje vive solo en el archivo privado importado, no en el código.

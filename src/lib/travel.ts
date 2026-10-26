export const hotel = {
  name: "Hotel Beverly",
  address: "Av. Nueva York 301, colonia Nápoles, Benito Juárez, CDMX, 03810",
  destination: "Hotel Beverly, Nueva York 301, Nápoles, Ciudad de México",
  url: "https://hotelbeverly.com.mx/",
};
export function mapRoute(
  destination: string,
  mode: "walking" | "driving" | "transit",
  origin?: string,
  waypoints: string[] = [],
) {
  const params = new URLSearchParams({
    api: "1",
    destination,
    travelmode: mode,
  });
  if (origin) params.set("origin", origin);
  if (waypoints.length) params.set("waypoints", waypoints.join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}
export const travelSources = {
  metro:
    "https://www.metro.cdmx.gob.mx/acerca-del-metro/mas-informacion/preguntas-frecuentes",
  line9: "https://www.metro.cdmx.gob.mx/la-red/linea-9",
  line1:
    "https://metrobus.cdmx.gob.mx/mapas-de-sistema/mapa-linea-1/L1-estaciones",
  metrobus:
    "https://metrobus.cdmx.gob.mx/portal-ciudadano/preguntas-frecuentes",
  fare: "https://www.metrobus.cdmx.gob.mx/dependencia/PagoMB",
};
export const places = [
  {
    name: "De Costa a Costa · Nápoles",
    kind: "Cena de mar",
    address: "Dakota 116, Nápoles, Ciudad de México",
    description:
      "Mariscos frente al WTC. Buena opción para una cena temprana al volver a la zona.",
    hours:
      "Vie 11:00–23:00 · sáb 11:00–22:00 · dom 11:00–20:00. Jueves: el sitio publica un horario inconsistente; confírmalo por teléfono.",
    url: "https://decostaacosta.mx/",
    phone: "+525556693600",
    source: "Restaurante · fuente oficial",
  },
  {
    name: "Día Uno",
    kind: "Cena variada",
    address: "Restaurante Día Uno, Nápoles, Ciudad de México",
    description:
      "Cocina mexicana e internacional cerca del WTC, para elegir entre varios estilos de comida.",
    hours:
      "Horario del jueves y cierre de cocina: por confirmar con el restaurante.",
    url: "https://diauno.com/",
    phone: "",
    source: "Restaurante · fuente oficial",
  },
  {
    name: "Twin Peaks · Insurgentes Sur",
    kind: "Ver el futbol",
    address: "Twin Peaks, Insurgentes Sur 674, Del Valle, Ciudad de México",
    description:
      "Sports bar con pantallas y comida americana. Llama para confirmar que transmitirán el partido y que se puede reservar mesa.",
    hours:
      "Jue–sáb 13:00–02:00 · dom 12:00–00:00 según ficha de OpenTable; confirmar con sucursal.",
    url: "https://twinpeaksmexico.mx/sucursales/insurgentes-sur/",
    phone: "+525585259443",
    source: "Ubicación oficial · horario de directorio",
    hoursUrl: "https://www.opentable.com/r/twin-peaks-mexico-ciudad-de-mexico",
  },
  {
    name: "Cantina La 20 · WTC",
    kind: "Cena + pantallas",
    address: "Cantina La 20, Filadelfia 38, Nápoles, Ciudad de México",
    description:
      "Alternativa de cocina mexicana en la zona del WTC. El directorio señala pantallas de futbol; confirma partido y disponibilidad antes de salir.",
    hours:
      "Jue–sáb 13:00–02:00 · dom 13:00–22:00 según directorio, sujeto a confirmación.",
    url: "https://cdmx365.com/es/cantina-la-20-wtc",
    phone: "",
    source: "CDMX365 · directorio independiente",
  },
];

/** Llegada en auto desde otro estado: reglas públicas, sin datos personales. */
export const driveSources = {
  pase: "https://www.paseturistico.cdmx.gob.mx/",
  paseTramite:
    "https://www.cdmx.gob.mx/public/InformacionTramite.xhtml?faces-redirect=true&idTramite=98",
  hoyNoCircula: "https://hoynocircula.cdmx.gob.mx/",
  foreignRules:
    "https://www.motorpasion.com.mx/industria/hoy-no-circula-placas-foraneas-octubre-2025",
  hotelParking:
    "https://www.kayak.com/Mexico-City-Hotels-Hotel-Beverly.515079.ksp",
};

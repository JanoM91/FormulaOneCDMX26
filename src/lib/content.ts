import type { Activity, Day, Driver, Preferences } from "./types";
import { dayDates } from "./time";
export const verifiedAt = "2026-10-26T14:30:00-06:00";
export const sources = {
  schedule:
    "https://www.formula1.com/en/latest/article/formula-1-gran-premio-de-la-ciudad-de-mexico-2026.14b3wTWzNNLJ5Wd8cG7HCQ",
  access: "https://www.mexicogp.mx/informacion/accesos/",
  map: "https://www.mexicogp.mx/mapa-de-accesos/",
  safety: "https://www.mexicogp.mx/informacion/seguridad/",
  f1: "https://www.formula1.com/en/latest",
  fia: "https://www.fia.com/events/fia-formula-one-world-championship/season-2026",
  mexico: "https://www.mexicogp.mx/",
  rules: "https://corp.formula1.com/f1-2026-regulations-terminology-update/",
};
export const days: Record<
  Day,
  {
    label: string;
    date: string;
    short: string;
    venue: string;
    zone: string;
    gate: string;
    color: string;
    arrival: string;
    focus: string;
    advice: string[];
  }
> = {
  friday: {
    label: "Viernes",
    date: "30 de octubre",
    short: "30 OCT",
    venue: "Grada 4",
    zone: "Azul",
    gate: "Puerta 9",
    color: "#1669b2",
    arrival: "08:00",
    focus: "Conoce la pista. Encuentra tu ritmo.",
    advice: [
      "En FP1 observa cómo se adaptan los autos a la altitud y dónde frenan.",
      "En FP2 compara tandas de varias vueltas: una vuelta rápida no cuenta toda la historia.",
      "Ubica baños, comida, salidas y un punto de reunión dentro de tu zona.",
    ],
  },
  saturday: {
    label: "Sábado",
    date: "31 de octubre",
    short: "31 OCT",
    venue: "Boxes Oro Sur",
    zone: "Gris",
    gate: "Puerta 2 del Palacio de los Deportes",
    color: "#626875",
    arrival: "08:30",
    focus: "Una vuelta puede cambiarlo todo.",
    advice: [
      "FP3 es la última oportunidad para afinar el auto antes de la clasificación.",
      "Q1 y Q2 eliminan a los más lentos. En Q3, los diez restantes buscan la pole: salir primero.",
      "Compara sectores, evita juzgar vueltas con tráfico y mira los intentos finales.",
    ],
  },
  sunday: {
    label: "Domingo",
    date: "1 de noviembre",
    short: "01 NOV",
    venue: "Grada 7",
    zone: "Amarilla",
    gate: "Puerta 13",
    color: "#a56b00",
    arrival: "08:15",
    focus: "Hoy se vive la carrera.",
    advice: [
      "Llega a tu asiento antes de la vuelta de formación: calientan neumáticos y frenos.",
      "Observa la largada y la primera frenada. Después sigue distancias y estrategias de pits.",
      "El paso por el estadio (antes Foro Sol) es uno de los momentos más especiales.",
    ],
  },
};
const raw: Record<Day, [string, string, string, boolean, string][]> = {
  friday: [
    [
      "08:40",
      "09:15",
      "GTM Super Copa · Práctica",
      false,
      "Identifica las líneas de frenado y aprende a reconocer los autos.",
    ],
    [
      "09:40",
      "10:05",
      "Masters Historic · Práctica",
      false,
      "Escucha cómo cambia el sonido entre generaciones de autos.",
    ],
    [
      "10:30",
      "10:55",
      "Formula 4 NACAM · Práctica",
      false,
      "Observa cómo los jóvenes pilotos buscan referencias.",
    ],
    [
      "11:00",
      "12:00",
      "Presentación de autos F1",
      false,
      "Actividad del programa oficial; el acceso depende de tu boleto.",
    ],
    [
      "12:30",
      "13:30",
      "Práctica libre 1",
      true,
      "Compara adaptación, tráfico y frenadas. Los equipos prueban configuraciones distintas.",
    ],
    [
      "14:00",
      "14:25",
      "GTM Super Copa · Clasificación",
      false,
      "Una vuelta rápida define su lugar de salida.",
    ],
    [
      "14:30",
      "15:30",
      "Conferencia de equipos",
      false,
      "Actividad de prensa; no implica acceso para público general.",
    ],
    [
      "16:00",
      "17:00",
      "Práctica libre 2",
      true,
      "Sigue varias vueltas del mismo piloto: la degradación importa más que una vuelta aislada.",
    ],
    [
      "17:30",
      "17:55",
      "Masters Historic · Clasificación",
      false,
      "Busca vueltas limpias y diferencias de estilo.",
    ],
  ],
  saturday: [
    [
      "09:25",
      "09:50",
      "Formula 4 NACAM · Clasificación",
      false,
      "Los mejores tiempos ordenan la parrilla.",
    ],
    [
      "10:15",
      "10:45",
      "GTM Super Copa · Carrera",
      false,
      "Observa salidas, adelantamientos y banderas.",
    ],
    [
      "11:30",
      "12:30",
      "Práctica libre 3",
      true,
      "Últimos ajustes. Mira intentos rápidos, pero recuerda que no todos llevan la misma gasolina.",
    ],
    [
      "12:55",
      "13:25",
      "Masters Historic · Carrera",
      false,
      "Disfruta la historia del automovilismo en movimiento.",
    ],
    [
      "15:00",
      "16:00",
      "Clasificación de Fórmula 1",
      true,
      "Q1 → Q2 → Q3. En Q3 los diez más rápidos compiten por salir primero: la pole position.",
    ],
    [
      "16:00",
      "17:00",
      "Conferencia de prensa",
      false,
      "Actividad de prensa; el horario puede coincidir con otras categorías.",
    ],
    [
      "16:45",
      "17:15",
      "Formula 4 NACAM · Carrera",
      false,
      "Sigue las batallas de los jóvenes pilotos.",
    ],
  ],
  sunday: [
    [
      "09:15",
      "09:45",
      "GTM Super Copa · Carrera",
      false,
      "Empieza el día con acción en pista.",
    ],
    [
      "10:10",
      "10:40",
      "Masters Historic · Carrera",
      false,
      "Una última oportunidad de ver los autos históricos.",
    ],
    [
      "11:05",
      "11:35",
      "Formula 4 NACAM · Carrera",
      false,
      "Observa cómo defienden posición antes de las frenadas.",
    ],
    [
      "12:00",
      "12:30",
      "Desfile de pilotos",
      false,
      "Ten lista tu cámara y busca a tu piloto favorito.",
    ],
    [
      "13:44",
      "13:46",
      "Himno nacional",
      false,
      "Permanece en tu lugar; la carrera está cerca.",
    ],
    [
      "14:00",
      "16:00",
      "Gran Premio de México",
      true,
      "71 vueltas programadas. Sigue la salida, las distancias, los neumáticos y las paradas.",
    ],
  ],
};
export const activities: Activity[] = Object.entries(raw).flatMap(
  ([key, rows]) =>
    rows.map(([start, end, name, f1, observe], i) => ({
      id: `${key}-${i}`,
      day: key as Day,
      name,
      start: `${dayDates[key as Day]}T${start}:00-06:00`,
      end: `${dayDates[key as Day]}T${end}:00-06:00`,
      f1,
      observe,
    })),
);
export const checklist = [
  "Boleto disponible en el teléfono",
  "Batería externa cargada",
  "Identificación",
  "Protector solar permitido",
  "Gorra y lentes de sol",
  "Impermeable ligero",
  "Calzado cómodo",
  "Método de pago revisado",
  "Medicamentos personales",
  "Punto de reunión acordado",
  "Asientos y accesos guardados offline",
  "Protección auditiva",
];
export const defaultPreferences: Preferences = {
  trip: {
    travelers: [],
    rooms: { solo: "", shared: "" },
    arrival: "Jueves 29 de octubre · por la tarde",
    football: "",
    luggage: false,
    checkedIn: false,
    drive: { origin: "", stop: null },
  },
  tickets: [],
  notes: { friday: "", saturday: "", sunday: "" },
  checklist: {},
  favorite: "",
  meeting: "",
  contrast: false,
  easy: false,
  theme: "paddock",
};
export const lessons = [
  [
    "La altura se siente",
    "El aire menos denso de Ciudad de México reduce el apoyo aerodinámico y dificulta la refrigeración. Los equipos ajustan el auto para equilibrar ambas cosas.",
  ],
  [
    "Una vuelta no lo dice todo",
    "En práctica cada equipo prueba distinta gasolina, neumáticos y ajustes. Compara tandas completas antes de sacar conclusiones.",
  ],
  [
    "Clasificación, en sencillo",
    "Q1, Q2 y Q3 son rondas de eliminación. Los diez que llegan a Q3 disputan la pole position: el primer lugar en la salida.",
  ],
  [
    "Blandos, medios y duros",
    "Los blandos suelen dar más agarre durante menos tiempo; los duros priorizan duración. La elección depende de temperatura, desgaste y estrategia.",
  ],
  [
    "Undercut y overcut",
    "Undercut: parar antes para aprovechar neumáticos nuevos. Overcut: quedarse más tiempo en pista e intentar ganar con vueltas rápidas o menos tráfico.",
  ],
  [
    "Safety Car y VSC",
    "El Safety Car reúne a los autos detrás de un coche de seguridad. Con VSC todos deben reducir su ritmo según una referencia; ninguno garantiza un adelantamiento.",
  ],
  [
    "Banderas que importan",
    "Amarilla: peligro, reduce velocidad y no adelantes. Roja: sesión detenida. Azul: facilita el paso cuando te están doblando. A cuadros: terminó la sesión.",
  ],
  [
    "La F1 de 2026",
    "La aerodinámica activa cambia la configuración de los alerones. Overtake Mode permite energía extra para atacar cuando se cumplen sus condiciones: no es el antiguo DRS.",
  ],
  [
    "Cómo se suman puntos",
    "En una carrera con puntuación completa, los diez primeros reciben 25, 18, 15, 12, 10, 8, 6, 4, 2 y 1. Una carrera acortada puede tener otra escala.",
  ],
  [
    "Penalizaciones",
    "Una sanción puede cambiar el resultado aunque no haya adelantamiento en pista. Espera la clasificación confirmada y consulta el documento FIA.",
  ],
  [
    "El estadio y nuestra historia",
    "La sección del estadio, conocida antes como Foro Sol, acerca la pista a las tribunas. El autódromo honra a Ricardo y Pedro Rodríguez, referentes del automovilismo mexicano.",
  ],
  [
    "La parrilla de salida",
    "Es el orden en que arrancan los autos. Puede diferir de la clasificación por sanciones o decisiones técnicas. La vuelta de formación prepara autos y neumáticos.",
  ],
];
export const news = [
  {
    title: "Ya puedes planear los tres días",
    summary:
      "El programa oficial incluye prácticas, clasificación y carrera, además de categorías de apoyo. Revisa cambios antes de salir.",
    source: "F1 · Oficial",
    url: sources.schedule,
    date: verifiedAt,
    kind: "Horario",
  },
  {
    title: "Revisa tu acceso antes de llegar",
    summary:
      "Las zonas tienen entradas distintas. Para Boxes Oro Sur conserva la indicación de tu boleto y confirma la Puerta 2 con el organizador.",
    source: "MéxicoGP · Oficial / nota personal",
    url: sources.access,
    date: verifiedAt,
    kind: "Accesos",
  },
  {
    title: "Prepara tu mochila con la lista vigente",
    summary:
      "Las reglas del recinto especifican tamaños y objetos admitidos. Comprueba la información oficial antes de empacar.",
    source: "MéxicoGP · Oficial",
    url: sources.safety,
    date: verifiedAt,
    kind: "Preparación",
  },
];
const roster = [
  ["russell", "George Russell", "63", "Británico", "Mercedes"],
  ["antonelli", "Kimi Antonelli", "12", "Italiano", "Mercedes"],
  ["leclerc", "Charles Leclerc", "16", "Monegasco", "Ferrari"],
  ["hamilton", "Lewis Hamilton", "44", "Británico", "Ferrari"],
  ["norris", "Lando Norris", "1", "Británico", "McLaren"],
  ["piastri", "Oscar Piastri", "81", "Australiano", "McLaren"],
  ["max_verstappen", "Max Verstappen", "3", "Neerlandés", "Red Bull Racing"],
  ["hadjar", "Isack Hadjar", "6", "Francés", "Red Bull Racing"],
  ["lawson", "Liam Lawson", "30", "Neozelandés", "Racing Bulls"],
  ["lindblad", "Arvid Lindblad", "41", "Británico", "Racing Bulls"],
  ["gasly", "Pierre Gasly", "10", "Francés", "Alpine"],
  ["colapinto", "Franco Colapinto", "43", "Argentino", "Alpine"],
  ["ocon", "Esteban Ocon", "31", "Francés", "Haas F1 Team"],
  ["bearman", "Oliver Bearman", "87", "Británico", "Haas F1 Team"],
  ["hulkenberg", "Nico Hülkenberg", "27", "Alemán", "Audi"],
  ["bortoleto", "Gabriel Bortoleto", "5", "Brasileño", "Audi"],
  ["sainz", "Carlos Sainz", "55", "Español", "Williams"],
  ["albon", "Alexander Albon", "23", "Tailandés", "Williams"],
  ["alonso", "Fernando Alonso", "14", "Español", "Aston Martin"],
  ["stroll", "Lance Stroll", "18", "Canadiense", "Aston Martin"],
  ["perez", "Sergio Pérez", "11", "Mexicano", "Cadillac"],
  ["bottas", "Valtteri Bottas", "77", "Finlandés", "Cadillac"],
];
export const drivers: Driver[] = roster.map(
  ([id, name, number, nationality, team]) => ({
    id,
    name,
    number,
    nationality,
    team,
    points: null,
    position: null,
    wins: null,
    url: "https://www.formula1.com/en/drivers",
  }),
);
export const teamColors: Record<string, string> = {
  Mercedes: "#007d79",
  Ferrari: "#c9202b",
  McLaren: "#b65000",
  "Red Bull Racing": "#274bc0",
  "Racing Bulls": "#4663ba",
  Alpine: "#19679b",
  "Haas F1 Team": "#505560",
  Audi: "#be3037",
  Williams: "#1d55a8",
  "Aston Martin": "#00634b",
  Cadillac: "#6a6151",
};
export function directions(day: Day) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(days[day].gate + ", " + (day === "saturday" ? "Ciudad de México" : "Autódromo Hermanos Rodríguez, Ciudad de México"))}&travelmode=walking`;
}

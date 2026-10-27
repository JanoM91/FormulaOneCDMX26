/**
 * Datos de escuderías, pilotos y curiosidades. Verificados el 26-oct-2026
 * (formula1.com, Wikipedia, sitios de equipos y prensa especializada).
 */
export type TeamInfo = {
  name: string;
  short: string;
  principal: string;
  base: string;
  engine: string;
  titles: string;
  debut: string;
  facts: string[];
  drivers: string[];
  source: string;
};

export const teamsInfo: TeamInfo[] = [
  {
    name: "Mercedes",
    short: "MER",
    principal: "Toto Wolff",
    base: "Brackley, Reino Unido",
    engine: "Mercedes",
    titles: "8 (2014–2021)",
    debut: "1954 · equipo actual desde 2010",
    facts: [
      "Sus 8 títulos fueron seguidos, de 2014 a 2021: la racha más larga de la historia.",
      "En su debut, Francia 1954, hizo el 1-2 y Fangio fue campeón ese año.",
    ],
    drivers: ["russell", "antonelli"],
    source: "https://www.formula1.com/en/teams/mercedes",
  },
  {
    name: "Ferrari",
    short: "FER",
    principal: "Frédéric Vasseur",
    base: "Maranello, Italia",
    engine: "Ferrari",
    titles: "16 (el último en 2008)",
    debut: "1950",
    facts: [
      "Único equipo que ha corrido todas las temporadas del Mundial desde 1950.",
      "El más ganador de la F1: 16 títulos de constructores.",
    ],
    drivers: ["leclerc", "hamilton"],
    source: "https://www.formula1.com/en/teams/ferrari",
  },
  {
    name: "McLaren",
    short: "MCL",
    principal: "Andrea Stella",
    base: "Woking, Reino Unido",
    engine: "Mercedes",
    titles: "10 (incluye 2024 y 2025)",
    debut: "1966",
    facts: [
      "Lo fundó en 1963 el piloto neozelandés Bruce McLaren.",
      "Campeón de constructores 2024 y 2025; Norris fue campeón de pilotos 2025.",
    ],
    drivers: ["norris", "piastri"],
    source: "https://www.formula1.com/en/teams/mclaren",
  },
  {
    name: "Red Bull Racing",
    short: "RBR",
    principal: "Laurent Mekies",
    base: "Milton Keynes, Reino Unido",
    engine: "Red Bull Ford",
    titles: "6 (2010–2013, 2022, 2023)",
    debut: "2005 (compró Jaguar)",
    facts: [
      "Mekies sustituyó a Christian Horner en julio de 2025.",
      "En 2026 deja Honda y estrena motor propio con Ford.",
    ],
    drivers: ["max_verstappen", "hadjar"],
    source: "https://www.formula1.com/en/teams/red-bull-racing",
  },
  {
    name: "Racing Bulls",
    short: "RB",
    principal: "Alan Permane",
    base: "Faenza, Italia",
    engine: "Red Bull Ford",
    titles: "0",
    debut: "1985 como Minardi",
    facts: [
      "Antes fue Minardi, Toro Rosso, AlphaTauri y RB.",
      "Con Toro Rosso, Vettel ganó Monza 2008 bajo la lluvia.",
    ],
    drivers: ["lawson", "lindblad"],
    source: "https://www.formula1.com/en/teams/racing-bulls",
  },
  {
    name: "Alpine",
    short: "ALP",
    principal:
      "Flavio Briatore (asesor ejecutivo) · Steve Nielsen (director general)",
    base: "Enstone, Reino Unido",
    engine: "Mercedes",
    titles: "2 como Renault (2005 y 2006)",
    debut: "2021 · linaje Toleman 1981",
    facts: [
      "En 2026 Renault dejó de hacer motores: Alpine usa Mercedes.",
      "Su única victoria como Alpine: Ocon en Hungría 2021.",
    ],
    drivers: ["gasly", "colapinto"],
    source: "https://www.formula1.com/en/teams/alpine",
  },
  {
    name: "Haas F1 Team",
    short: "HAA",
    principal: "Ayao Komatsu",
    base: "Kannapolis, EE. UU.",
    engine: "Ferrari",
    titles: "0",
    debut: "2016",
    facts: [
      "Sumó puntos en su primera carrera: Grosjean, 6.º en Australia 2016.",
      "Su mejor resultado, un 4.º lugar, incluye México 2025 con Bearman.",
    ],
    drivers: ["ocon", "bearman"],
    source: "https://www.formula1.com/en/teams/haas",
  },
  {
    name: "Audi",
    short: "AUD",
    principal: "Mattia Binotto",
    base: "Hinwil, Suiza",
    engine: "Audi",
    titles: "0",
    debut: "2026 (compró Sauber, 1993)",
    facts: [
      "Su antecesora, Auto Union, corrió Grandes Premios de 1935 a 1939.",
      "Bortoleto sumó sus primeros puntos: 9.º en Australia 2026.",
    ],
    drivers: ["hulkenberg", "bortoleto"],
    source: "https://formula1.com/en/teams/audi",
  },
  {
    name: "Williams",
    short: "WIL",
    principal: "James Vowles",
    base: "Grove, Reino Unido",
    engine: "Mercedes",
    titles: "9",
    debut: "1977",
    facts: [
      "Primera victoria: Regazzoni, Gran Bretaña 1979.",
      "Más de 100 victorias y siete pilotos campeones.",
    ],
    drivers: ["sainz", "albon"],
    source: "https://www.formula1.com/en/teams/williams",
  },
  {
    name: "Aston Martin",
    short: "AMR",
    principal: "Adrian Newey",
    base: "Silverstone, Reino Unido",
    engine: "Honda",
    titles: "0",
    debut: "2021 · linaje Jordan 1991",
    facts: [
      "Newey, el diseñador más laureado de la F1, es jefe de equipo.",
      "En 2026 empezó su alianza de fábrica con Honda.",
    ],
    drivers: ["alonso", "stroll"],
    source: "https://www.formula1.com/en/teams/aston-martin",
  },
  {
    name: "Cadillac",
    short: "CAD",
    principal: "Marcin Budkowski",
    base: "Fishers, EE. UU. · Silverstone, R. U.",
    engine: "Ferrari",
    titles: "0",
    debut: "2026",
    facts: [
      "Equipo número 11: el primero nuevo desde Haas en 2016.",
      "Budkowski reemplazó a Graeme Lowdon en agosto de 2026.",
    ],
    drivers: ["perez", "bottas"],
    source: "https://www.formula1.com/en/teams/cadillac",
  },
];

export const driverFacts: Record<string, { flag: string; fact: string }> = {
  russell: {
    flag: "🇬🇧",
    fact: "Campeón de GP3 y F2; ganó la primera carrera de 2026.",
  },
  antonelli: {
    flag: "🇮🇹",
    fact: "Cinco victorias seguidas en 2026; llega a México como líder.",
  },
  leclerc: {
    flag: "🇲🇨",
    fact: "Campeón de GP3 y de F2 como novato; ganó Silverstone 2026.",
  },
  hamilton: {
    flag: "🇬🇧",
    fact: "Siete títulos; primera victoria con Ferrari en Barcelona 2026.",
  },
  norris: {
    flag: "🇬🇧",
    fact: "Campeón 2025 por dos puntos; ganó México 2025 desde la pole.",
  },
  piastri: { flag: "🇦🇺", fact: "Ganó F3 y F2 en sus temporadas de novato." },
  max_verstappen: {
    flag: "🇳🇱",
    fact: "Cuatro títulos y máximo ganador en México: 5 victorias.",
  },
  hadjar: {
    flag: "🇫🇷",
    fact: "Subcampeón de F2 2024; primer podio en Zandvoort 2025.",
  },
  lawson: {
    flag: "🇳🇿",
    fact: "Debutó en Zandvoort 2023 sustituyendo a Ricciardo.",
  },
  lindblad: {
    flag: "🇬🇧",
    fact: "Ganador más joven de la F2; debutó a los 18 años.",
  },
  gasly: { flag: "🇫🇷", fact: "Campeón de GP2 2016; ganó Monza 2020." },
  colapinto: { flag: "🇦🇷", fact: "Primer argentino en la F1 desde 2001." },
  ocon: { flag: "🇫🇷", fact: "Ganó Hungría 2021, la única victoria de Alpine." },
  bearman: { flag: "🇬🇧", fact: "Cuarto en México 2025: su mejor resultado." },
  hulkenberg: {
    flag: "🇩🇪",
    fact: "Primer podio en su arranque 240; ganó Le Mans 2015.",
  },
  bortoleto: { flag: "🇧🇷", fact: "Campeón de F3 2023 y F2 2024." },
  sainz: { flag: "🇪🇸", fact: "Ganó el GP de la Ciudad de México 2024." },
  albon: {
    flag: "🇹🇭",
    fact: "Corre con bandera tailandesa; dos podios con Red Bull.",
  },
  alonso: {
    flag: "🇪🇸",
    fact: "Bicampeón y piloto con más Grandes Premios de la historia.",
  },
  stroll: { flag: "🇨🇦", fact: "Novato más joven en un podio: Bakú 2017." },
  perez: { flag: "🇲🇽", fact: "Seis victorias en F1; tercero en casa en 2021." },
  bottas: {
    flag: "🇫🇮",
    fact: "Récord de vuelta del autódromo: 1:17.774 (2021).",
  },
};

export const f1Facts = [
  "Autos 30 kg más ligeros: mínimo de 768 kg.",
  "Más compactos: 3.4 m entre ejes y 1.9 m de ancho.",
  "Potencia casi 50/50 entre combustión y electricidad.",
  "Combustible 100% sostenible y adiós al MGU-H.",
  "Aerodinámica activa: el DRS se sustituye por un modo de adelantamiento.",
  "11 equipos: Cadillac es el primero nuevo desde 2016.",
  "Audi debuta, Red Bull hace motor con Ford y Honda vuelve con Aston Martin.",
];

export const mexicoFacts = [
  "A ~2,240 m de altitud el aire es ~25% menos denso.",
  "Con alerón de Mónaco, los autos tienen la carga de Monza.",
  "4.304 km, 17 curvas y 71 vueltas.",
  "Recta de ~1.2 km: en 2025 se alcanzaron 363 km/h.",
  "Desde 2015 la pista cruza el estadio, antes Foro Sol.",
  "Primer GP en 1962; volvió en 2015 tras 23 años.",
  "Honra a Ricardo y Pedro Rodríguez.",
  "Más de 400,000 asistentes tres años seguidos.",
  "Verstappen tiene 5 victorias aquí; Norris ganó en 2025.",
];

export const factSources = {
  regs: "https://www.formula1.com/en/latest/article/fia-unveils-formula-1-regulations-for-2026-and-beyond-featuring-more-agile.75qJiYOHXgeJqsVQtDr2UB",
  mexico: "https://en.wikipedia.org/wiki/Autódromo_Hermanos_Rodríguez",
  teams: "https://www.formula1.com/en/teams",
};

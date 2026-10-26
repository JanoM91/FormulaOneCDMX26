/**
 * Imágenes con licencia libre (Wikimedia Commons), optimizadas y servidas desde /public/media.
 * Regla: solo autos, pista y circuito. Nunca retratos de personas reales.
 * Cada entrada conserva autor, licencia y página de origen para mostrar el crédito.
 */
export type Media = {
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  /** Recorte sugerido para object-position (ej. "50% 60%"). */
  focus?: string;
  /** Aclaración cuando el auto no es exactamente el modelo 2026. */
  note?: string;
};

/** Foto del auto de cada piloto (clave = id del piloto). */
export const driverCars: Partial<Record<string, Media>> = {
  russell: {
    src: "/media/cars/russell.webp",
    width: 960,
    height: 480,
    alt: "Auto Mercedes número 63 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._63_Russell_(3).jpg",
    focus: "50% 50%",
  },
  antonelli: {
    src: "/media/cars/antonelli.webp",
    width: 960,
    height: 480,
    alt: "Auto Mercedes número 12 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._12_Antonelli_(3).jpg",
    focus: "50% 50%",
  },
  leclerc: {
    src: "/media/cars/leclerc.webp",
    width: 960,
    height: 480,
    alt: "Auto Ferrari número 16 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._16_Leclerc_(3).jpg",
    focus: "50% 50%",
  },
  hamilton: {
    src: "/media/cars/hamilton.webp",
    width: 960,
    height: 480,
    alt: "Auto Ferrari número 44 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._44_Hamilton_(3).jpg",
    focus: "50% 50%",
  },
  norris: {
    src: "/media/cars/norris.webp",
    width: 960,
    height: 480,
    alt: "Auto McLaren número 1 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._1_Norris_(3).jpg",
    focus: "50% 50%",
  },
  piastri: {
    src: "/media/cars/piastri.webp",
    width: 960,
    height: 480,
    alt: "Auto McLaren número 81 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._81_Piastri_(3).jpg",
    focus: "50% 50%",
  },
  max_verstappen: {
    src: "/media/cars/max_verstappen.webp",
    width: 960,
    height: 480,
    alt: "Auto Red Bull Racing número 3 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._3_Verstappen_(3).jpg",
    focus: "50% 50%",
  },
  hadjar: {
    src: "/media/cars/hadjar.webp",
    width: 960,
    height: 480,
    alt: "Auto Red Bull Racing número 6 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._6_Hadjar_(3).jpg",
    focus: "50% 50%",
  },
  lawson: {
    src: "/media/cars/lawson.webp",
    width: 960,
    height: 480,
    alt: "Auto Racing Bulls número 30 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._30_Lawson_(3).jpg",
    focus: "50% 50%",
  },
  lindblad: {
    src: "/media/cars/lindblad.webp",
    width: 960,
    height: 480,
    alt: "Auto Racing Bulls número 41 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._41_Lindblad_(3).jpg",
    focus: "50% 50%",
  },
  gasly: {
    src: "/media/cars/gasly.webp",
    width: 960,
    height: 540,
    alt: "Auto Alpine número 10 en pista, temporada 2026",
    author: "Eustace Bagge",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pierre_Gasly_2026_Italian_Grand_Prix_qualifying_-_1.jpg",
    focus: "50% 50%",
  },
  colapinto: {
    src: "/media/cars/colapinto.webp",
    width: 960,
    height: 540,
    alt: "Auto Alpine número 43 en pista, temporada 2026",
    author: "Yu Chu Chin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Alpine_A526_of_Franco_Colapinto_(028A8063).jpg",
    focus: "50% 50%",
  },
  ocon: {
    src: "/media/cars/ocon.webp",
    width: 960,
    height: 480,
    alt: "Auto Haas F1 Team número 31 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._31_Ocon_(3).jpg",
    focus: "50% 50%",
  },
  bearman: {
    src: "/media/cars/bearman.webp",
    width: 960,
    height: 540,
    alt: "Auto Haas F1 Team número 87 en pista, temporada 2026",
    author: "Jason Puddephatt",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ollie_Bearman_HAAS_F1_Car_(55382811332).jpg",
    focus: "50% 50%",
  },
  hulkenberg: {
    src: "/media/cars/hulkenberg.webp",
    width: 960,
    height: 480,
    alt: "Auto Audi número 27 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._27_H%C3%BClkenberg_(3).jpg",
    focus: "50% 50%",
  },
  bortoleto: {
    src: "/media/cars/bortoleto.webp",
    width: 960,
    height: 540,
    alt: "Auto Audi número 5 en pista, temporada 2026",
    author: "Hraynor",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Gabriel_Bortoleto_British_Grand_Prix_2026.jpg",
    focus: "50% 50%",
  },
  sainz: {
    src: "/media/cars/sainz.webp",
    width: 960,
    height: 540,
    alt: "Auto Williams número 55 en pista, temporada 2026",
    author: "Liauzh",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_Chinese_GP_-_Williams_-_Carlos_Sainz_-_FP1.jpg",
    focus: "50% 50%",
  },
  albon: {
    src: "/media/cars/albon.webp",
    width: 960,
    height: 480,
    alt: "Auto Williams número 23 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._23_Albon_(3).jpg",
    focus: "50% 50%",
  },
  alonso: {
    src: "/media/cars/alonso.webp",
    width: 960,
    height: 480,
    alt: "Auto Aston Martin número 14 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._14_Alonso_(3).jpg",
    focus: "50% 50%",
  },
  stroll: {
    src: "/media/cars/stroll.webp",
    width: 960,
    height: 480,
    alt: "Auto Aston Martin número 18 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._18_Stroll_(3).jpg",
    focus: "50% 50%",
  },
  perez: {
    src: "/media/cars/perez.webp",
    width: 960,
    height: 480,
    alt: "Auto Cadillac número 11 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._11_Perez_(3).jpg",
    focus: "50% 50%",
  },
  bottas: {
    src: "/media/cars/bottas.webp",
    width: 960,
    height: 540,
    alt: "Auto Cadillac número 77 en pista, temporada 2026",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2026_Nr._77_Bottas_(2).jpg",
    focus: "50% 50%",
  },
};

/** Foto representativa por escudería (primer piloto de la alineación). */
export const teamCars: Partial<Record<string, Media>> = {
  Mercedes: driverCars["russell"],
  Ferrari: driverCars["leclerc"],
  McLaren: driverCars["norris"],
  "Red Bull Racing": driverCars["max_verstappen"],
  "Racing Bulls": driverCars["lawson"],
  Alpine: driverCars["gasly"],
  "Haas F1 Team": driverCars["ocon"],
  Audi: driverCars["hulkenberg"],
  Williams: driverCars["sainz"],
  "Aston Martin": driverCars["alonso"],
  Cadillac: driverCars["perez"],
};

/** Imágenes de la pista y el recinto. */
export const trackMedia: {
  hero?: Media;
  aerial?: Media;
  layout?: Media;
} = {
  hero: {
    src: "/media/track/hero.webp",
    width: 1280,
    height: 720,
    alt: "Vista aérea del Foro Sol y la zona del estadio del Autódromo Hermanos Rodríguez",
    author: "ProtoplasmaKid",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_02.jpg",
  },
  aerial: {
    src: "/media/track/aerial.webp",
    width: 1280,
    height: 720,
    alt: "Vista aérea de la recta principal, los pits y las gradas del Autódromo Hermanos Rodríguez",
    author: "ProtoplasmaKid",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_03.jpg",
  },
  layout: {
    src: "/media/track/layout.webp",
    width: 900,
    height: 726,
    alt: "Trazado del Autódromo Hermanos Rodríguez con sectores y curvas numeradas",
    author: "ごひょううべこ",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2022_F1_CourseLayout_Mexico.svg",
    note: "trazado vigente; las zonas DRS corresponden a 2022 y no aplican en 2026",
  },
};

export function allMedia(): Media[] {
  return [...Object.values(trackMedia), ...Object.values(driverCars)].filter(
    (m): m is Media => Boolean(m),
  );
}

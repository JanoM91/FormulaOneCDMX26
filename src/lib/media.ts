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

/** Foto del auto por escudería (clave = nombre en `teamColors`). */
export const teamCars: Partial<Record<string, Media>> = {};

/** Imágenes de la pista y el recinto. */
export const trackMedia: {
  hero?: Media;
  aerial?: Media;
  layout?: Media;
  stadium?: Media;
} = {};

export function allMedia(): Media[] {
  return [...Object.values(trackMedia), ...Object.values(teamCars)].filter(
    (m): m is Media => Boolean(m),
  );
}

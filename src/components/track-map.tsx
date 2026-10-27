"use client";
import type { Day } from "@/lib/types";
import { days } from "@/lib/content";

/**
 * Trazado esquemático del Autódromo Hermanos Rodríguez (sentido de carrera:
 * recta principal hacia la curva 1, horquilla, enlazadas y estadio).
 * Dibujo propio a partir de la forma pública del circuito; no es a escala.
 */
const TRACK =
  "M 300 78 L 800 78 C 842 78 858 98 858 122 C 858 142 842 150 846 170 L 796 330 L 768 452 C 764 474 782 486 790 504 L 742 598 C 728 626 692 622 690 594 L 690 420 C 690 384 668 366 640 354 C 600 338 560 346 522 326 C 492 310 480 282 446 264 C 420 250 382 242 332 240 L 202 238 C 186 238 180 230 176 214 L 162 160 C 156 140 140 138 130 148 C 120 158 100 168 76 168 C 50 168 44 140 50 114 C 56 94 66 78 100 78 Z";

const stands: {
  id: Day;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  label: [number, number];
}[] = [
  // Viernes · Grada 4 (zona azul, curva 1)
  { id: "friday", x: 830, y: 30, w: 70, h: 26, r: 12, label: [556, 100] },
  // Sábado · Boxes Oro Sur (estadio)
  { id: "saturday", x: 70, y: 186, w: 80, h: 26, r: 0, label: [20, 262] },
  // Domingo · Grada 7 (zona amarilla, horquilla)
  { id: "sunday", x: 806, y: 486, w: 70, h: 26, r: -30, label: [690, 610] },
];

const context = [
  // Gradas de referencia (sin selección)
  [210, 40, 110, 20, 0],
  [340, 40, 60, 20, 0],
  [470, 40, 110, 20, 0],
  [880, 120, 22, 60, 0],
  [880, 210, 22, 60, 15],
  [720, 300, 60, 22, -70],
  [660, 470, 22, 70, 0],
  [640, 600, 70, 22, 30],
  [120, 110, 60, 22, -10],
];

export function TrackMap({
  selected,
  onSelect,
}: {
  selected: Day;
  onSelect: (d: Day) => void;
}) {
  return (
    <figure className="track-map">
      <svg
        viewBox="0 0 960 700"
        role="img"
        aria-label={`Trazado del Autódromo Hermanos Rodríguez con nuestros lugares. Seleccionado: ${days[selected].label}, ${days[selected].venue}.`}
      >
        <path d={TRACK} className="tm-runoff" />
        <path d={TRACK} className="tm-track" />
        <path d={TRACK} className="tm-line" />
        <path d="M 300 66 L 300 90" className="tm-start" />
        <g className="tm-arrows">
          <path d="M 600 70 l 14 8 l -14 8" />
          <path d="M 812 260 l 8 14 l 8 -14" transform="rotate(-12 820 266)" />
          <path d="M 682 480 l 8 -14 l 8 14" />
          <path d="M 280 230 l -14 8 l 14 8" />
        </g>
        <g className="tm-context">
          {context.map(([x, y, w, h, r], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              rx="4"
              transform={`rotate(${r} ${x + w / 2} ${y + h / 2})`}
            />
          ))}
        </g>
        <text x="40" y="60" className="tm-label">
          ESTADIO
        </text>
        <text x="230" y="128" className="tm-label">
          RECTA PRINCIPAL
        </text>
        {stands.map((s) => {
          const d = days[s.id],
            active = s.id === selected;
          return (
            <g
              key={s.id}
              className={`tm-stand ${active ? "active" : ""}`}
              style={{ "--c": d.color } as React.CSSProperties}
              onClick={() => onSelect(s.id)}
              role="button"
              tabIndex={0}
              aria-label={`${d.label}: ${d.venue}`}
              aria-pressed={active}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(s.id);
              }}
            >
              <rect
                x={s.x}
                y={s.y}
                width={s.w}
                height={s.h}
                rx="5"
                transform={`rotate(${s.r} ${s.x + s.w / 2} ${s.y + s.h / 2})`}
              />
              <g transform={`translate(${s.label[0]} ${s.label[1]})`}>
                <rect width="260" height="86" rx="14" className="tm-pill" />
                <text x="18" y="32" className="tm-pill-day">
                  {d.label.toUpperCase()}
                </text>
                <text x="18" y="70" className="tm-pill-venue">
                  {d.venue}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <figcaption>
        Esquema del circuito, no a escala. Confirma tu acceso con el boleto.
      </figcaption>
    </figure>
  );
}

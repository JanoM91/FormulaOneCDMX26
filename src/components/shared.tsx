"use client";
import {
  MapPin,
  Share2,
  Ticket as TicketIcon,
  Flag,
  Sparkles,
} from "lucide-react";
import type { Day, Preferences, Ticket } from "@/lib/types";
import { activities, days, directions, ticketFor } from "@/lib/content";
import { activityState, clock } from "@/lib/time";
import { External } from "./primitives";

export type TripDay = Day | "thursday";
export const tripDays: {
  id: TripDay;
  label: string;
  short: string;
  color: string;
}[] = [
  { id: "thursday", label: "Jueves", short: "29", color: "#00b864" },
  { id: "friday", label: "Viernes", short: "30", color: days.friday.color },
  { id: "saturday", label: "Sábado", short: "31", color: days.saturday.color },
  { id: "sunday", label: "Domingo", short: "01", color: days.sunday.color },
];

export function DayTabs<T extends TripDay>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (d: T) => void;
  options: T[];
}) {
  return (
    <div className="day-tabs" role="tablist" aria-label="Día">
      {tripDays
        .filter((d) => options.includes(d.id as T))
        .map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={value === d.id}
            onClick={() => onChange(d.id as T)}
            style={{ "--c": d.color } as React.CSSProperties}
          >
            <small>{d.label.slice(0, 3)}</small>
            <strong>{d.short}</strong>
          </button>
        ))}
    </div>
  );
}

export function ticketText(
  day: Day,
  ticket: Ticket | undefined,
  meeting: string,
) {
  const d = days[day];
  return `Si nos separamos:\nDía: ${d.label} ${d.date}\n${d.venue} · Zona ${d.zone}\nAcceso: ${d.gate}\nSección: ${ticket?.section ?? "Pendiente"}\nFila: ${ticket?.row ?? "Pendiente"}\nAsientos: ${ticket?.seats ?? "Pendientes"}${meeting ? `\nPunto de reunión: ${meeting}` : ""}`;
}
export function whatsapp(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Boleto compacto: lugar, sección/fila/asientos y acceso. */
export function TicketCard({ day, prefs }: { day: Day; prefs: Preferences }) {
  const d = days[day],
    t = ticketFor(day, prefs.tickets);
  return (
    <section
      className="ticket-mini"
      style={{ "--zone": d.color } as React.CSSProperties}
    >
      <div className="tm-head">
        <TicketIcon size={18} />
        <strong>{d.venue}</strong>
        <span className="zone-tag">Zona {d.zone}</span>
      </div>
      <div className="tm-seats">
        <div>
          <span>Sección</span>
          <strong>{t?.section ?? "—"}</strong>
        </div>
        <div>
          <span>Fila</span>
          <strong>{t?.row ?? "—"}</strong>
        </div>
        <div>
          <span>Asientos</span>
          <strong>{t?.seats ?? "—"}</strong>
        </div>
      </div>
      <div className="tm-foot">
        <span>
          <MapPin size={16} /> {d.gate}
        </span>
        <div className="icon-links">
          <External href={directions(day)} className="chip">
            Ruta
          </External>
          <External
            href={whatsapp(ticketText(day, t, prefs.meeting))}
            className="chip"
          >
            <Share2 size={14} /> Compartir
          </External>
        </div>
      </div>
    </section>
  );
}

/** Agenda del día: hora + nombre; el detalle queda oculto. */
export function AgendaList({ day, now }: { day: Day; now: Date }) {
  return (
    <ol className="agenda-mini">
      {activities
        .filter((a) => a.day === day)
        .map((a) => {
          const state = activityState(a, now);
          return (
            <li
              key={a.id}
              className={`${a.f1 ? "f1" : ""} ${state === "En horario" ? "current" : ""}`}
            >
              <details>
                <summary>
                  <time>{clock(a.start)}</time>
                  {a.f1 ? <Flag size={15} /> : <Sparkles size={15} />}
                  <span>{a.name}</span>
                </summary>
                <p>
                  {clock(a.start)}–{clock(a.end)} · {state}
                  <br />
                  {a.observe}
                </p>
              </details>
            </li>
          );
        })}
    </ol>
  );
}

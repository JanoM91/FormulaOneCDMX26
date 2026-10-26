import type { Activity, Day, Provenance } from "./types";
export const TIMEZONE = "America/Mexico_City";
export const dayDates: Record<Day, string> = {
  friday: "2026-10-30",
  saturday: "2026-10-31",
  sunday: "2026-11-01",
};
export function localDate(now: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function eventDay(now: Date): Day {
  const date = localDate(now);
  return date < dayDates.saturday
    ? "friday"
    : date === dayDates.saturday
      ? "saturday"
      : "sunday";
}
export function clock(value: string | Date) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}
export function fullTime(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}
export function nextActivity(activities: Activity[], now: Date) {
  return activities.find((a) => new Date(a.end).getTime() > now.getTime());
}
export function activityState(a: Activity, now: Date) {
  return now < new Date(a.start)
    ? "Próximo"
    : now < new Date(a.end)
      ? "En horario"
      : "Finalizado";
}
export function countdown(date: string, now: Date) {
  const s = Math.max(
    0,
    Math.floor((new Date(date).getTime() - now.getTime()) / 1000),
  );
  return `${Math.floor(s / 86400)}d ${String(Math.floor((s % 86400) / 3600)).padStart(2, "0")}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`;
}
export function freshness(meta: Provenance, now: Date, offline = false) {
  if (meta.status === "demo") return "Demo";
  if (!meta.updatedAt || meta.status === "unavailable")
    return "Actualización pendiente";
  if (offline || meta.status === "last-known") return "Último dato disponible";
  if (
    meta.status === "live" &&
    now.getTime() - new Date(meta.updatedAt).getTime() <= 90000
  )
    return "En vivo";
  return "Retrasado";
}
export function lapTime(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds)) return "—";
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(3).padStart(6, "0")}`;
}
export function gapTime(value: number | string | null) {
  return typeof value === "number" ? `+${value.toFixed(3)} s` : (value ?? "—");
}

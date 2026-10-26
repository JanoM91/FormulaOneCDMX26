import { z } from "zod";
import type { TimingRow } from "./types";
const num = z.number().finite();
const stamp = z.string().refine((x) => Number.isFinite(Date.parse(x)));
export const driverSchema = z.object({
  driver_number: num,
  full_name: z.string(),
  team_name: z.string().nullable().optional(),
});
export const sessionSchema = z.object({
  session_key: num,
  session_name: z.string(),
  session_type: z.string(),
  date_start: stamp,
  date_end: stamp,
  year: num,
  country_name: z.string(),
});
export const positionSchema = z.object({
  driver_number: num,
  position: num,
  date: stamp,
});
export const lapSchema = z.object({
  driver_number: num,
  lap_duration: num.nullable().optional(),
  lap_number: num,
  date_start: stamp.nullable().optional(),
});
export const intervalSchema = z.object({
  driver_number: num,
  gap_to_leader: z.union([num, z.string()]).nullable().optional(),
  interval: z.union([num, z.string()]).nullable().optional(),
  date: stamp,
});
export const stintSchema = z.object({
  driver_number: num,
  stint_number: num,
  compound: z.string().nullable().optional(),
});
export const pitSchema = z.object({ driver_number: num, date: stamp });
export const controlSchema = z.object({
  message: z.string(),
  date: stamp,
  flag: z.string().nullable().optional(),
});
export type TimingInput = {
  drivers: z.infer<typeof driverSchema>[];
  positions: z.infer<typeof positionSchema>[];
  laps: z.infer<typeof lapSchema>[];
  intervals: z.infer<typeof intervalSchema>[];
  stints: z.infer<typeof stintSchema>[];
  pits: z.infer<typeof pitSchema>[];
};
export function normalizeTiming(data: TimingInput): TimingRow[] {
  return data.drivers
    .map((d) => {
      const positions = data.positions
        .filter((p) => p.driver_number === d.driver_number)
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
      const p = positions.at(-1),
        previous = positions.at(-2);
      const laps = data.laps
        .filter((l) => l.driver_number === d.driver_number)
        .sort((a, b) => a.lap_number - b.lap_number);
      const last = laps.at(-1),
        valid = laps
          .map((l) => l.lap_duration)
          .filter((n): n is number => typeof n === "number" && n > 0);
      const interval = data.intervals
        .filter((i) => i.driver_number === d.driver_number)
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        .at(-1);
      const stint = data.stints
        .filter((s) => s.driver_number === d.driver_number)
        .sort((a, b) => a.stint_number - b.stint_number)
        .at(-1);
      const stamps = [p?.date, interval?.date, last?.date_start]
        .filter((x): x is string => !!x)
        .sort((a, b) => Date.parse(a) - Date.parse(b));
      return {
        number: d.driver_number,
        name: d.full_name,
        team: d.team_name ?? "Sin equipo confirmado",
        position: p?.position ?? null,
        change: p && previous ? previous.position - p.position : null,
        lastLap: last?.lap_duration ?? null,
        bestLap: valid.length ? Math.min(...valid) : null,
        lap: last?.lap_number ?? null,
        gap: interval?.gap_to_leader ?? null,
        interval: interval?.interval ?? null,
        tyre: stint?.compound ?? null,
        pits: data.pits.filter((x) => x.driver_number === d.driver_number)
          .length,
        updatedAt: stamps.at(-1) ?? null,
      };
    })
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
}

export type Day = "friday" | "saturday" | "sunday";
export type Section = "inicio" | "viaje" | "live" | "pilotos" | "mapa" | "guia";
export type Provenance = {
  source: string;
  url: string;
  updatedAt: string | null;
  confidence: "official" | "alternative" | "editorial" | "demo";
  status: "live" | "delayed" | "last-known" | "unavailable" | "demo";
};
export type Activity = {
  id: string;
  day: Day;
  name: string;
  start: string;
  end: string;
  f1: boolean;
  observe: string;
};
export type DriveStop = {
  label: string;
  address: string;
  window: string;
  note: string;
};
export type DrivePlan = { origin: string; stop: DriveStop | null };
export type Ticket = { day: Day; section: string; row: string; seats: string };
export type Preferences = {
  trip: {
    travelers: { initials: string; name: string; room: "solo" | "shared" }[];
    rooms: { solo: string; shared: string };
    arrival: string;
    football: string;
    luggage: boolean;
    checkedIn: boolean;
    drive: DrivePlan;
  };
  tickets: Ticket[];
  notes: Record<Day, string>;
  checklist: Record<string, boolean>;
  favorite: string;
  meeting: string;
  contrast: boolean;
  easy: boolean;
  theme: "paddock" | "fiesta" | "telemetry";
};
export type TimingRow = {
  number: number;
  name: string;
  team: string;
  position: number | null;
  change: number | null;
  lastLap: number | null;
  bestLap: number | null;
  lap: number | null;
  gap: number | string | null;
  interval: number | string | null;
  tyre: string | null;
  pits: number | null;
  updatedAt: string | null;
};
export type Timing = {
  meta: Provenance;
  session: string;
  sessionState: string;
  message: string;
  rows: TimingRow[];
  control: { message: string; flag: string | null; date: string }[];
};
export type Driver = {
  id: string;
  name: string;
  number: string;
  nationality: string;
  team: string;
  points: string | null;
  position: string | null;
  wins: string | null;
  url: string;
};
export type Grid = { meta: Provenance; drivers: Driver[] };
export type Teams = {
  meta: Provenance;
  teams: { name: string; position: string; points: string; wins: string }[];
};
export type Weather = {
  meta: Provenance;
  temperature: number;
  apparent: number;
  rain: number;
  code: number;
  daily: { date: string; min: number; max: number; rain: number }[];
};

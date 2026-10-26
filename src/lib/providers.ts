import { z } from "zod";
import { activities, drivers, sources, verifiedAt } from "./content";
import type { Grid, Timing, Weather, Teams } from "./types";
import {
  controlSchema,
  driverSchema,
  intervalSchema,
  lapSchema,
  normalizeTiming,
  pitSchema,
  positionSchema,
  sessionSchema,
  stintSchema,
} from "./normalize";

type Fetcher = typeof fetch;
const alternative = {
  source: "OpenF1 · independiente",
  url: "https://openf1.org/",
  confidence: "alternative" as const,
};
export interface TimingProvider {
  getTiming(): Promise<Timing>;
}
export class OfficialF1Provider {
  getSchedule() {
    return {
      data: activities,
      source: sources.schedule,
      updatedAt: verifiedAt,
    };
  }
}
export class MexicoGPProvider {
  getAccess() {
    return { url: sources.access, map: sources.map, updatedAt: verifiedAt };
  }
}
export class FIAProvider {
  getDocuments() {
    return {
      url: sources.fia,
      status: "Consulta oficial; sin feed público integrado",
    };
  }
}

async function json(
  fetcher: Fetcher,
  url: string,
  seconds: number,
  headers?: HeadersInit,
) {
  const response = await fetcher(url, {
    headers,
    signal: AbortSignal.timeout(12000),
    next: { revalidate: seconds },
  });
  if (!response.ok) {
    if (response.status === 401) tokenCache = null;
    throw new Error(`Provider status ${response.status}`);
  }
  return response.json();
}
let tokenCache: { value: string; expires: number } | null = null;
let tokenFlight: Promise<string | null> | null = null;
async function accessToken(fetcher: Fetcher): Promise<string | null> {
  if (!process.env.OPENF1_USERNAME || !process.env.OPENF1_PASSWORD) return null;
  if (tokenCache && tokenCache.expires > Date.now() + 60000)
    return tokenCache.value;
  if (tokenFlight) return tokenFlight;
  tokenFlight = (async () => {
    const r = await fetcher("https://api.openf1.org/token", {
      method: "POST",
      body: new URLSearchParams({
        username: process.env.OPENF1_USERNAME!,
        password: process.env.OPENF1_PASSWORD!,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error("OpenF1 authentication unavailable");
    const data = z
      .object({
        access_token: z.string(),
        expires_in: z.coerce.number().positive(),
      })
      .parse(await r.json());
    tokenCache = {
      value: data.access_token,
      expires: Date.now() + data.expires_in * 1000,
    };
    return data.access_token;
  })();
  try {
    return await tokenFlight;
  } finally {
    tokenFlight = null;
  }
}

export class OpenF1Provider implements TimingProvider {
  constructor(
    private fetcher: Fetcher = fetch,
    private now: () => Date = () => new Date(),
  ) {}
  async getTiming(): Promise<Timing> {
    const token = await accessToken(this.fetcher);
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const read = async (path: string, seconds = 30) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return json(
        this.fetcher,
        `https://api.openf1.org/v1/${path}`,
        seconds,
        headers,
      );
    };
    const sessions = z
      .array(sessionSchema)
      .parse(await read("sessions?year=2026&country_name=Mexico", 300));
    const now = this.now();
    const eligible = sessions
      .filter(
        (s) =>
          s.year === 2026 &&
          s.country_name === "Mexico" &&
          new Date(s.date_start) <= now,
      )
      .sort((a, b) => Date.parse(b.date_start) - Date.parse(a.date_start));
    const session = eligible[0];
    if (!session)
      return {
        meta: { ...alternative, updatedAt: null, status: "unavailable" },
        session: "México 2026",
        sessionState: "Próximo",
        message:
          "Todavía no hay una sesión de México 2026 iniciada. El horario y la guía ya están disponibles.",
        rows: [],
        control: [],
      };
    const active = now <= new Date(session.date_end);
    if (active && !token)
      return {
        meta: { ...alternative, updatedAt: null, status: "unavailable" },
        session: session.session_name,
        sessionState: "Actualización pendiente",
        message:
          "El directo necesita la conexión de OpenF1 configurada en el servidor. Puedes consultar la demo por separado.",
        rows: [],
        control: [],
      };
    const query = `session_key=${session.session_key}`;
    const recent = active
      ? `&date>=${encodeURIComponent(new Date(now.getTime() - 300000).toISOString())}`
      : "";
    // Small sequential batches avoid a burst against the provider. Shared Next data cache revalidates each endpoint.
    const ds = z
      .array(driverSchema)
      .parse(await read(`drivers?${query}`, 3600));
    const ps = z
      .array(positionSchema)
      .parse(await read(`position?${query}${recent}`));
    const ls = z.array(lapSchema).parse(await read(`laps?${query}`));
    const ins = z
      .array(intervalSchema)
      .parse(await read(`intervals?${query}${recent}`));
    const ss = z.array(stintSchema).parse(await read(`stints?${query}`));
    const pits = z.array(pitSchema).parse(await read(`pit?${query}`));
    const control = z
      .array(controlSchema)
      .parse(await read(`race_control?${query}`))
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      .slice(0, 15)
      .map((c) => ({ ...c, flag: c.flag ?? null }));
    const rows = normalizeTiming({
      drivers: ds,
      positions: ps,
      laps: ls,
      intervals: ins,
      stints: ss,
      pits,
    });
    const dates = rows
      .flatMap((r) => (r.updatedAt ? [r.updatedAt] : []))
      .sort((a, b) => Date.parse(a) - Date.parse(b));
    const updatedAt = dates.at(-1) ?? null;
    const fresh =
      updatedAt !== null && now.getTime() - Date.parse(updatedAt) < 90000;
    return {
      meta: {
        ...alternative,
        updatedAt,
        status: active ? (fresh ? "live" : "delayed") : "last-known",
      },
      session: session.session_name,
      sessionState: active
        ? "Sesión en horario"
        : "Sesión terminada según horario",
      message:
        "Datos de OpenF1, proveedor independiente. Las decisiones y resultados definitivos corresponden a FIA. Los mensajes originales de Race Control se conservan en su idioma.",
      rows,
      control,
    };
  }
}
export class FallbackResultsProvider {
  constructor(private fetcher: Fetcher = fetch) {}
  async getGrid(): Promise<Grid> {
    try {
      const response = await json(
        this.fetcher,
        "https://api.jolpi.ca/ergast/f1/2026/driverstandings/?format=json",
        900,
      );
      const row = z.object({
        position: z.string(),
        points: z.string(),
        wins: z.string(),
        Driver: z.object({
          driverId: z.string(),
          givenName: z.string(),
          familyName: z.string(),
          permanentNumber: z.string().optional(),
          nationality: z.string(),
        }),
        Constructors: z.array(z.object({ name: z.string() })),
      });
      const parsed = z
        .object({
          MRData: z.object({
            StandingsTable: z.object({
              StandingsLists: z.array(
                z.object({
                  season: z.string(),
                  round: z.string(),
                  DriverStandings: z.array(row),
                }),
              ),
            }),
          }),
        })
        .parse(response);
      const list = parsed.MRData.StandingsTable.StandingsLists.find(
        (l) => l.season === "2026",
      );
      if (!list?.DriverStandings.length) throw new Error("No standings");
      return {
        meta: {
          source: `Jolpica · clasificación tras ronda ${list.round}`,
          url: "https://api.jolpi.ca/ergast/f1/2026/driverstandings/",
          updatedAt: new Date().toISOString(),
          confidence: "alternative",
          status: "last-known",
        },
        drivers: list.DriverStandings.map((r) => ({
          id: r.Driver.driverId,
          name: `${r.Driver.givenName} ${r.Driver.familyName}`,
          number:
            drivers.find((d) => d.id === r.Driver.driverId)?.number ??
            r.Driver.permanentNumber ??
            "—",
          nationality:
            drivers.find((d) => d.id === r.Driver.driverId)?.nationality ??
            r.Driver.nationality,
          team: r.Constructors.at(-1)?.name ?? "Pendiente",
          points: r.points,
          position: r.position,
          wins: r.wins,
          url: "https://www.formula1.com/en/results/2026/drivers",
        })),
      };
    } catch {
      return {
        meta: {
          source: "F1 · alineación de temporada consultada",
          url: "https://www.formula1.com/en/drivers",
          updatedAt: verifiedAt,
          confidence: "official",
          status: "last-known",
        },
        drivers,
      };
    }
  }
}
export async function getTeams(fetcher: Fetcher = fetch): Promise<Teams> {
  const url =
    "https://api.jolpi.ca/ergast/f1/2026/constructorstandings/?format=json";
  const row = z.object({
    position: z.string(),
    points: z.string(),
    wins: z.string(),
    Constructor: z.object({ name: z.string() }),
  });
  const parsed = z
    .object({
      MRData: z.object({
        StandingsTable: z.object({
          StandingsLists: z.array(
            z.object({
              season: z.string(),
              round: z.string(),
              ConstructorStandings: z.array(row),
            }),
          ),
        }),
      }),
    })
    .parse(await json(fetcher, url, 900));
  const list = parsed.MRData.StandingsTable.StandingsLists.find(
    (l) => l.season === "2026",
  );
  if (!list?.ConstructorStandings.length)
    throw new Error("No constructor standings");
  return {
    meta: {
      source: `Jolpica · constructores tras ronda ${list.round}`,
      url,
      updatedAt: new Date().toISOString(),
      confidence: "alternative",
      status: "last-known",
    },
    teams: list.ConstructorStandings.map((r) => ({
      name: r.Constructor.name,
      position: r.position,
      points: r.points,
      wins: r.wins,
    })),
  };
}
export async function getWeather(fetcher: Fetcher = fetch): Promise<Weather> {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=19.4042&longitude=-99.0907&current=temperature_2m,apparent_temperature,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FMexico_City&forecast_days=7";
  const number = z.number().finite();
  const p = z
    .object({
      current: z.object({
        time: z.string(),
        temperature_2m: number,
        apparent_temperature: number,
        precipitation: number,
        weather_code: number,
      }),
      daily: z.object({
        time: z.array(z.string()),
        temperature_2m_max: z.array(number),
        temperature_2m_min: z.array(number),
        precipitation_probability_max: z.array(number),
      }),
    })
    .parse(await json(fetcher, url, 600));
  return {
    meta: {
      source: "Open-Meteo · estimación meteorológica",
      url: "https://open-meteo.com/",
      updatedAt: new Date(p.current.time + "-06:00").toISOString(),
      confidence: "alternative",
      status: "last-known",
    },
    temperature: p.current.temperature_2m,
    apparent: p.current.apparent_temperature,
    rain: p.current.precipitation,
    code: p.current.weather_code,
    daily: p.daily.time.map((date, i) => ({
      date,
      min: p.daily.temperature_2m_min[i],
      max: p.daily.temperature_2m_max[i],
      rain: p.daily.precipitation_probability_max[i],
    })),
  };
}
export function demoTiming(): Timing {
  return {
    meta: {
      source: "Simulación local",
      url: "https://openf1.org/docs/",
      updatedAt: null,
      confidence: "demo",
      status: "demo",
    },
    session: "Demo · carrera ilustrativa",
    sessionState: "Demo",
    message:
      "SIMULACIÓN. Posiciones, tiempos y mensajes inventados para aprender a usar la pantalla. No representan una sesión real.",
    rows: drivers.slice(0, 12).map((d, i) => ({
      number: Number(d.number),
      name: d.name,
      team: d.team,
      position: i + 1,
      change: i === 2 ? 2 : 0,
      lastLap: 80 + i * 0.12,
      bestLap: 79.7 + i * 0.1,
      lap: 20,
      gap: i === 0 ? 0 : i * 1.4,
      interval: i === 0 ? null : i === 2 ? 0.7 : 1.4,
      tyre: i % 2 ? "MEDIUM" : "HARD",
      pits: 1,
      updatedAt: null,
    })),
    control: [
      {
        message:
          "DEMO: Safety Car en pista. Los autos deben reducir la velocidad.",
        flag: "SAFETY CAR",
        date: "2026-11-01T14:30:00-06:00",
      },
    ],
  };
}

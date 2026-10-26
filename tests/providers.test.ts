import test from "node:test";
import assert from "node:assert/strict";
import {
  FallbackResultsProvider,
  OpenF1Provider,
  demoTiming,
  getWeather,
  getTeams,
} from "../src/lib/providers";
function stub(value: unknown, status = 200) {
  return (async () =>
    new Response(JSON.stringify(value), { status })) as typeof fetch;
}
test("constructors use their own standings, including zero points", async () => {
  const r = await getTeams(
    stub({
      MRData: {
        StandingsTable: {
          StandingsLists: [
            {
              season: "2026",
              round: "1",
              ConstructorStandings: [
                {
                  position: "11",
                  points: "0",
                  wins: "0",
                  Constructor: { name: "Example" },
                },
              ],
            },
          ],
        },
      },
    }),
  );
  assert.equal(r.teams[0].points, "0");
  assert.match(r.meta.source, /ronda 1/);
});
test("OpenF1 returns pending before Mexico and never substitutes another GP", async () => {
  const p = new OpenF1Provider(
    stub([
      {
        session_key: 10,
        session_name: "Race",
        session_type: "Race",
        year: 2026,
        country_name: "United States",
        date_start: "2026-10-25T20:00:00Z",
        date_end: "2026-10-25T22:00:00Z",
      },
    ]),
    () => new Date("2026-10-26T18:00:00Z"),
  );
  const r = await p.getTiming();
  assert.equal(r.meta.status, "unavailable");
  assert.equal(r.rows.length, 0);
});
test("malformed OpenF1 response is rejected rather than treated as real timing", async () => {
  await assert.rejects(() =>
    new OpenF1Provider(stub({ bad: "schema" })).getTiming(),
  );
});
test("historical provider aggregates recorded data and labels last-known", async () => {
  const session = {
    session_key: 42,
    session_name: "Race",
    session_type: "Race",
    year: 2026,
    country_name: "Mexico",
    date_start: "2026-11-01T20:00:00Z",
    date_end: "2026-11-01T22:00:00Z",
  };
  const fetcher = (async (input: RequestInfo | URL) => {
    const url = String(input);
    const endpoint = new URL(url).pathname.split("/").at(-1);
    const fixtures: Record<string, unknown> = {
      sessions: [session],
      drivers: [
        { driver_number: 9, full_name: "Test Driver", team_name: "Test" },
      ],
      position: [
        { driver_number: 9, position: 1, date: "2026-11-01T21:40:00Z" },
      ],
      laps: [
        {
          driver_number: 9,
          lap_number: 71,
          lap_duration: 80.2,
          date_start: "2026-11-01T21:39:00Z",
        },
      ],
      intervals: [],
      stints: [],
      pit: [],
      race_control: [],
    };
    return new Response(JSON.stringify(fixtures[endpoint!]));
  }) as typeof fetch;
  const r = await new OpenF1Provider(
    fetcher,
    () => new Date("2026-11-02T18:00:00Z"),
  ).getTiming();
  assert.equal(r.meta.status, "last-known");
  assert.equal(r.rows[0].position, 1);
  assert.equal(r.rows[0].bestLap, 80.2);
  assert.equal(r.meta.updatedAt, "2026-11-01T21:40:00Z");
});
test("standings outage returns official roster without invented points", async () => {
  const r = await new FallbackResultsProvider(stub({}, 503)).getGrid();
  assert.equal(r.drivers.length, 22);
  assert.ok(r.drivers.every((d) => d.points === null));
  assert.equal(r.meta.status, "last-known");
});
test("demo is explicit and has no fabricated real update timestamp", () => {
  const r = demoTiming();
  assert.equal(r.meta.status, "demo");
  assert.equal(r.meta.updatedAt, null);
  assert.match(r.message, /SIMULACIÓN/);
});
test("weather timestamps are interpreted in Mexico timezone", async () => {
  const r = await getWeather(
    stub({
      current: {
        time: "2026-10-26T12:00",
        temperature_2m: 20,
        apparent_temperature: 21,
        precipitation: 0,
        weather_code: 0,
      },
      daily: {
        time: ["2026-10-26"],
        temperature_2m_max: [25],
        temperature_2m_min: [12],
        precipitation_probability_max: [10],
      },
    }),
  );
  assert.equal(r.meta.updatedAt, "2026-10-26T18:00:00.000Z");
  assert.equal(r.daily[0].rain, 10);
});
test("weather schema rejects null or missing measurements", async () => {
  await assert.rejects(() =>
    getWeather(stub({ current: { temperature_2m: null } })),
  );
});

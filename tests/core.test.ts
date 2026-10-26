import test from "node:test";
import assert from "node:assert/strict";
import { activities } from "../src/lib/content";
import {
  activityState,
  clock,
  eventDay,
  freshness,
  localDate,
  nextActivity,
  lapTime,
} from "../src/lib/time";
import { ticketImportSchema } from "../src/lib/preferences";
import { normalizeTiming } from "../src/lib/normalize";
import { gapTime } from "../src/lib/time";
test("gap display rounds floating point values and preserves lap deficit text", () => {
  assert.equal(gapTime(4.19999999999), "+4.200 s");
  assert.equal(gapTime("+1 LAP"), "+1 LAP");
  assert.equal(gapTime(null), "—");
});
test("all 22 activities are complete, ordered, unique and in the event window", () => {
  assert.equal(activities.length, 22);
  assert.equal(new Set(activities.map((a) => a.id)).size, 22);
  assert.ok(activities.every((a) => new Date(a.start) < new Date(a.end)));
  assert.deepEqual(
    activities.map((a) => a.start),
    activities.map((a) => a.start).sort(),
  );
});
test("Mexico midnight does not inherit browser timezone", () => {
  const now = new Date("2026-10-31T04:59:00Z");
  assert.equal(localDate(now), "2026-10-30");
  assert.equal(eventDay(now), "friday");
  assert.equal(clock("2026-11-01T20:00:00Z"), "14:00");
});
test("day defaults clamp before and after weekend", () => {
  assert.equal(eventDay(new Date("2026-10-26T18:00:00Z")), "friday");
  assert.equal(eventDay(new Date("2026-11-03T18:00:00Z")), "sunday");
});
test("next activity excludes ended events and handles finished weekend", () => {
  const first = activities[0];
  assert.equal(
    nextActivity(activities, new Date(first.end))?.id,
    activities[1].id,
  );
  assert.equal(
    nextActivity(activities, new Date("2026-11-02T00:00:00Z")),
    undefined,
  );
});
test("scheduled activity is never advertised as confirmed live", () => {
  assert.equal(
    activityState(activities[0], new Date(activities[0].start)),
    "En horario",
  );
  assert.equal(
    activityState(activities[0], new Date(activities[0].end)),
    "Finalizado",
  );
});
test("stale data loses live status and offline preserves original time", () => {
  const meta = {
    source: "x",
    url: "https://example.com",
    confidence: "alternative" as const,
    status: "live" as const,
    updatedAt: "2026-11-01T20:00:00Z",
  };
  assert.equal(freshness(meta, new Date("2026-11-01T20:00:30Z")), "En vivo");
  assert.equal(freshness(meta, new Date("2026-11-01T20:03:00Z")), "Retrasado");
  assert.equal(
    freshness(meta, new Date("2026-11-01T20:00:30Z"), true),
    "Último dato disponible",
  );
});
test("private ticket import rejects duplicate days and drops unrelated sensitive fields", () => {
  const ticket = {
    day: "friday",
    section: "A",
    row: "1",
    seats: "1, 2",
    account: "must disappear",
  };
  const result = ticketImportSchema.parse({
    tickets: [ticket],
    token: "ignore",
  });
  assert.deepEqual(Object.keys(result.tickets[0]), [
    "day",
    "section",
    "row",
    "seats",
  ]);
  assert.equal(
    ticketImportSchema.safeParse({ tickets: [ticket, ticket] }).success,
    false,
  );
});
test("timing sorts chronological records, keeps zero gaps and ignores null laps", () => {
  const rows = normalizeTiming({
    drivers: [
      { driver_number: 9, full_name: "Test Driver", team_name: "Test" },
    ],
    positions: [
      { driver_number: 9, position: 1, date: "2026-11-01T20:01:00Z" },
      { driver_number: 9, position: 3, date: "2026-11-01T20:00:00Z" },
    ],
    laps: [
      { driver_number: 9, lap_number: 1, lap_duration: 82 },
      { driver_number: 9, lap_number: 2, lap_duration: null },
    ],
    intervals: [
      {
        driver_number: 9,
        date: "2026-11-01T20:01:00Z",
        gap_to_leader: 0,
        interval: null,
      },
    ],
    stints: [{ driver_number: 9, stint_number: 1, compound: "HARD" }],
    pits: [],
  });
  assert.equal(rows[0].change, 2);
  assert.equal(rows[0].gap, 0);
  assert.equal(rows[0].bestLap, 82);
  assert.equal(rows[0].lastLap, null);
  assert.equal(rows[0].pits, 0);
});
test("lap formatter never invents missing time", () => {
  assert.equal(lapTime(null), "—");
  assert.equal(lapTime(81.234), "1:21.234");
});

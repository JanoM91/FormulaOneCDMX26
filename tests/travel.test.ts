import test from "node:test";
import assert from "node:assert/strict";
import { preferencesSchema, tripImportSchema } from "../src/lib/preferences";
import { defaultPreferences } from "../src/lib/content";
import { hotel, mapRoute } from "../src/lib/travel";

test("existing preferences acquire trip defaults without losing tickets, notes or accessibility", () => {
  const { trip: _trip, ...legacy } = defaultPreferences;
  const saved = preferencesSchema.parse({
    ...legacy,
    tickets: [{ day: "friday", section: "TEST", row: "2", seats: "3" }],
    notes: { ...legacy.notes, friday: "Keep me" },
    contrast: true,
  });
  assert.equal(saved.tickets[0].section, "TEST");
  assert.equal(saved.notes.friday, "Keep me");
  assert.equal(saved.contrast, true);
  assert.deepEqual(saved.trip.travelers, []);
});
test("trip import preserves room assignment and strips unrelated private credentials", () => {
  const result = tripImportSchema.parse({
    trip: {
      ...defaultPreferences.trip,
      travelers: [
        {
          initials: "AAA",
          name: "Test One",
          room: "shared",
          passport: "discard",
        },
        { initials: "BBB", name: "Test Two", room: "solo" },
      ],
      rooms: { solo: "501", shared: "503" },
      token: "discard",
    },
  });
  assert.equal(result.trip.travelers[1].room, "solo");
  assert.equal(result.trip.rooms.shared, "503");
  assert.equal("passport" in result.trip.travelers[0], false);
  assert.equal("token" in result.trip, false);
});
test("trip rejects duplicate identities, unknown rooms and oversized room numbers", () => {
  const person = { initials: "AAA", name: "Test One", room: "solo" };
  assert.equal(
    tripImportSchema.safeParse({
      trip: { ...defaultPreferences.trip, travelers: [person, person] },
    }).success,
    false,
  );
  assert.equal(
    tripImportSchema.safeParse({
      trip: {
        ...defaultPreferences.trip,
        travelers: [{ ...person, room: "invalid" }],
      },
    }).success,
    false,
  );
  assert.equal(
    tripImportSchema.safeParse({
      trip: {
        ...defaultPreferences.trip,
        rooms: { solo: "1".repeat(21), shared: "" },
      },
    }).success,
    false,
  );
});
test("Maps encodes public destinations and lets arrival origin be selected on device", () => {
  const arriving = new URL(mapRoute(hotel.destination, "transit"));
  assert.equal(arriving.searchParams.has("origin"), false);
  assert.equal(arriving.searchParams.get("destination"), hotel.destination);
  const route = new URL(
    mapRoute(
      "Puerta 9, Autódromo Hermanos Rodríguez",
      "transit",
      hotel.destination,
    ),
  );
  assert.equal(route.searchParams.get("origin"), hotel.destination);
  assert.equal(route.searchParams.get("travelmode"), "transit");
});
test("trips saved before the drive plan migrate with an empty drive", () => {
  const { drive: _drive, ...legacyTrip } = defaultPreferences.trip;
  const result = tripImportSchema.parse({ trip: legacyTrip });
  assert.deepEqual(result.trip.drive, { origin: "", stop: null });
});
test("drive plan accepts a stop and rejects a stop without address", () => {
  const ok = tripImportSchema.parse({
    trip: {
      ...defaultPreferences.trip,
      drive: {
        origin: "Ciudad A",
        stop: {
          label: "Trámite",
          address: "Calle 1, Ciudad B",
          window: "10:00–18:00",
          note: "",
        },
      },
    },
  });
  assert.equal(ok.trip.drive.stop?.label, "Trámite");
  const bad = tripImportSchema.safeParse({
    trip: {
      ...defaultPreferences.trip,
      drive: {
        origin: "Ciudad A",
        stop: { label: "X", address: "", window: "", note: "" },
      },
    },
  });
  assert.equal(bad.success, false);
});
test("driving route keeps the stop as a waypoint", () => {
  const url = new URL(
    mapRoute(hotel.destination, "driving", "Ciudad A", ["Calle 1, Ciudad B"]),
  );
  assert.equal(url.searchParams.get("origin"), "Ciudad A");
  assert.equal(url.searchParams.get("waypoints"), "Calle 1, Ciudad B");
  assert.equal(url.searchParams.get("travelmode"), "driving");
});

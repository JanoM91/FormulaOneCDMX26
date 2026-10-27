"use client";
import { useState } from "react";
import {
  BedDouble,
  MapPin,
  TrainFront,
  Car,
  Utensils,
  Users,
  Upload,
  ArrowRight,
  GraduationCap,
  Clock3,
  Lightbulb,
  NotebookPen,
  Luggage,
  CalendarDays,
  Hotel,
  Phone,
} from "lucide-react";
import type { Day, Preferences } from "@/lib/types";
import { days, sources } from "@/lib/content";
import { tripImportSchema, tripSchema } from "@/lib/preferences";
import {
  driveSources,
  hotel,
  mapRoute,
  places,
  travelSources,
} from "@/lib/travel";
import { External, Fold, Notice } from "./primitives";
import {
  AgendaList,
  DayTabs,
  TicketCard,
  tripDays,
  type TripDay,
} from "./shared";
type Trip = Preferences["trip"];

export function TravelPanel({
  prefs,
  save,
  changeNotes,
  tripDay,
  setTripDay,
  now,
}: {
  prefs: Preferences;
  save: (t: Trip) => void;
  changeNotes: (day: Day, value: string) => void;
  tripDay: TripDay;
  setTripDay: (d: TripDay) => void;
  now: Date;
}) {
  const trip = prefs.trip;
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  async function importTrip(file?: File) {
    if (!file) return;
    try {
      if (file.size > 20000) throw new Error();
      const result = tripImportSchema.parse(JSON.parse(await file.text()));
      save(result.trip);
      setEditing(false);
      setMessage("Viaje importado en este teléfono.");
    } catch {
      setMessage("Archivo no válido; no se cambió nada.");
    }
  }
  const f1Day = tripDay === "thursday" ? null : (tripDay as Day);
  return (
    <div className="travel-panel">
      <div className="page-title">
        <h1>Viaje</h1>
        <span className="page-sub">29 oct — 1 nov</span>
      </div>
      <DayTabs
        value={tripDay}
        onChange={setTripDay}
        options={tripDays.map((d) => d.id)}
      />
      {tripDay === "thursday" && (
        <div className="stack">
          <DriveCard trip={trip} />
          <section className="hotel-mini card">
            <div className="hm-head">
              <Hotel size={22} />
              <div>
                <strong>{hotel.name}</strong>
                <small>Nápoles · Nueva York 301</small>
              </div>
            </div>
            <div className="hm-times">
              <div>
                <span>Check-in · jue</span>
                <strong>15:00</strong>
              </div>
              <div>
                <span>Check-out · dom</span>
                <strong>12:00</strong>
              </div>
            </div>
            <div className="icon-links">
              <External
                className="chip"
                href={mapRoute(hotel.destination, "driving")}
              >
                <MapPin size={14} /> Maps
              </External>
              <External className="chip" href={hotel.url}>
                Sitio
              </External>
            </div>
          </section>
          <Fold
            icon={<BedDouble />}
            title="Cuartos y check-in"
            hint={
              trip.checkedIn
                ? `Listo · ${trip.rooms.solo || "—"} / ${trip.rooms.shared || "—"}`
                : "Capturar al llegar"
            }
          >
            <div className="room-grid">
              {(["solo", "shared"] as const).map((room) => (
                <label key={room}>
                  {room === "solo" ? "Individual" : "Compartido"}
                  <small>
                    {trip.travelers
                      .filter((p) => p.room === room)
                      .map((p) => p.initials)
                      .join(" + ") || "—"}
                  </small>
                  <input
                    aria-label={
                      room === "solo"
                        ? "Número de cuarto individual"
                        : "Número de cuarto compartido"
                    }
                    maxLength={20}
                    placeholder="N.º de cuarto"
                    value={trip.rooms[room]}
                    onChange={(e) =>
                      save({
                        ...trip,
                        rooms: { ...trip.rooms, [room]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <label className="toggle">
              Check-in completado
              <input
                type="checkbox"
                checked={trip.checkedIn}
                onChange={(e) => save({ ...trip, checkedIn: e.target.checked })}
              />
            </label>
            <label className="toggle">
              Consigna del domingo confirmada
              <input
                type="checkbox"
                checked={trip.luggage}
                onChange={(e) => save({ ...trip, luggage: e.target.checked })}
              />
            </label>
            <p className="fine">
              Habitaciones reservadas: Suite junior; confirmar en recepción.
            </p>
          </Fold>
          <Fold
            icon={<Users />}
            title="Nosotros"
            hint={
              trip.travelers.length
                ? trip.travelers.map((p) => p.initials).join(" · ")
                : "Importar viajeros"
            }
          >
            {trip.travelers.length > 0 && (
              <div className="crew-row">
                {trip.travelers.map((p) => (
                  <span key={p.initials} title={p.name}>
                    <b>{p.initials}</b>
                    <small>
                      {p.room === "solo" ? "Individual" : "Compartido"}
                    </small>
                  </span>
                ))}
              </div>
            )}
            <label className="import-button">
              <Upload size={18} /> Importar nuestro viaje
              <span className="import-hint">
                Archivo .json que te compartieron
              </span>
              <input
                aria-label="Importar nuestro viaje"
                type="file"
                accept="application/json,.json"
                onChange={(e) => void importTrip(e.target.files?.[0])}
              />
            </label>
            <button
              className="button secondary"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cerrar edición" : "Editar viajeros"}
            </button>
            {editing && (
              <TravelerForm
                key={JSON.stringify(trip.travelers)}
                trip={trip}
                save={(t) => {
                  save(t);
                  setEditing(false);
                  setMessage("Viajeros guardados en este teléfono.");
                }}
              />
            )}
            <p role="status" className="save-status">
              {message}
            </p>
          </Fold>
          <DiningFold football={trip.football} />
        </div>
      )}
      {f1Day && (
        <div className="stack">
          <TicketCard day={f1Day} prefs={prefs} />
          <div className="tile-row">
            <div className="tile">
              <Clock3 size={18} />
              <span>Llegar</span>
              <strong>{days[f1Day].arrival}</strong>
            </div>
            <div className="tile">
              <MapPin size={18} />
              <span>Acceso</span>
              <strong>
                {days[f1Day].gate.replace(" del Palacio de los Deportes", "")}
              </strong>
            </div>
          </div>
          {f1Day === "saturday" && (
            <Notice>
              Puerta 2 del Palacio de los Deportes: distinta a viernes y
              domingo.
            </Notice>
          )}
          {f1Day === "sunday" && (
            <Notice>
              Check-out antes de las 12:00. No llevar maletas al circuito.
            </Notice>
          )}
          <h3 className="group-title">
            <CalendarDays size={16} /> Agenda
          </h3>
          <AgendaList day={f1Day} now={now} />
          <p className="fine">
            Hora CDMX ·{" "}
            <a href={sources.schedule} target="_blank" rel="noreferrer">
              programa oficial
            </a>
          </p>
          <RouteFold day={f1Day} />
          <Fold icon={<Lightbulb />} title="Tips del día">
            <ul className="facts">
              {days[f1Day].advice.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Fold>
          <Fold
            icon={<NotebookPen />}
            title="Notas"
            hint={prefs.notes[f1Day] ? "Con notas" : "Vacío"}
          >
            <textarea
              aria-label={`Notas del ${days[f1Day].label}`}
              value={prefs.notes[f1Day]}
              maxLength={3000}
              placeholder="Qué ver, qué comprar…"
              onChange={(e) => changeNotes(f1Day, e.target.value)}
            />
          </Fold>
          {f1Day !== "sunday" && <DiningFold football={trip.football} />}
          {f1Day === "sunday" && (
            <Fold icon={<Luggage />} title="Salida del hotel">
              <p>
                La salida vence a las 12:00, durante el programa. Consigna o
                salida tardía: confirmar con recepción.
              </p>
            </Fold>
          )}
        </div>
      )}
    </div>
  );
}

function RouteFold({ day }: { day: Day }) {
  const destination = `${days[day].gate}, Autódromo Hermanos Rodríguez, Ciudad de México`;
  return (
    <Fold
      icon={<TrainFront />}
      title="Cómo llegar"
      hint="Metrobús + Metro · $11 por persona"
    >
      <p className="route-badge">
        L1 roja <ArrowRight size={15} /> L9 café
      </p>
      <ol className="route-steps">
        <li>
          Metrobús <b>Ciudad de los Deportes</b> hacia el norte.
        </li>
        <li>
          Bajar en <b>Chilpancingo</b>.
        </li>
        <li>
          Metro L9 dirección <b>Pantitlán</b>.
        </li>
        <li>
          Bajar en <b>Ciudad Deportiva o Puebla</b> según la puerta.
        </li>
      </ol>
      <div className="icon-links">
        <External
          className="chip"
          href={mapRoute(destination, "transit", hotel.destination)}
        >
          Ruta en transporte
        </External>
        <External
          className="chip"
          href={mapRoute(destination, "driving", hotel.destination)}
        >
          <Car size={14} /> En coche
        </External>
        <External className="chip" href="https://m.uber.com/">
          Uber
        </External>
      </div>
      <details className="more">
        <summary>Horarios y regreso</summary>
        <p>
          Regreso: L9 hacia Tacubaya → Chilpancingo → Metrobús L1 al sur. Metro
          $5 (sáb 06:00, dom 07:00); Metrobús $6. Una tarjeta de Movilidad
          Integrada por persona.
        </p>
        <div className="icon-links">
          <External href={travelSources.line9}>Metro L9</External>
          <External href={travelSources.line1}>Metrobús L1</External>
          <External href={sources.access}>Accesos MéxicoGP</External>
        </div>
      </details>
    </Fold>
  );
}

function DiningFold({ football }: { football: string }) {
  return (
    <Fold
      icon={<Utensils />}
      title="Cena y futbol"
      hint={football || "Cerca del hotel"}
    >
      <ul className="place-list">
        {places.map((p) => (
          <li key={p.name}>
            <div>
              <strong>{p.name}</strong>
              <small>{p.kind}</small>
            </div>
            <div className="icon-links">
              <External
                className="chip"
                href={mapRoute(p.address, "walking", hotel.destination)}
              >
                <MapPin size={14} />
              </External>
              {p.phone && (
                <a
                  className="chip"
                  href={`tel:${p.phone}`}
                  aria-label={`Llamar a ${p.name}`}
                >
                  <Phone size={14} />
                </a>
              )}
            </div>
            <details className="more">
              <summary>Horario</summary>
              <p>{p.hours}</p>
              <External href={p.url}>Sitio</External>
            </details>
          </li>
        ))}
      </ul>
    </Fold>
  );
}

function DriveCard({ trip }: { trip: Trip }) {
  const { origin, stop } = trip.drive;
  if (!origin) return null;
  const waypoints = stop ? [stop.address] : [];
  return (
    <section className="card drive-card">
      <ol className="drive-flow">
        <li>
          <Car size={18} />
          <div>
            <span>Salida temprano</span>
            <strong>{origin}</strong>
          </div>
        </li>
        {stop && (
          <li>
            <GraduationCap size={18} />
            <div>
              <span>
                {stop.window || "Parada"} · antes o después del check-in
              </span>
              <strong>{stop.label}</strong>
            </div>
          </li>
        )}
        <li>
          <Hotel size={18} />
          <div>
            <span>Check-in desde 15:00</span>
            <strong>{hotel.name}</strong>
          </div>
        </li>
      </ol>
      <div className="icon-links">
        <External
          className="button primary"
          href={mapRoute(hotel.destination, "driving", origin, waypoints)}
        >
          Ruta completa
        </External>
        {stop && (
          <External
            className="chip"
            href={mapRoute(hotel.destination, "driving", stop.address)}
          >
            ITAM → hotel
          </External>
        )}
      </div>
      <details className="more">
        <summary>Hoy No Circula y estacionamiento</summary>
        <p>
          Placas de Veracruz: sin holograma CDMX no circulan L–V de 5:00 a
          11:00, un día por placa ni sábados. El <b>Pase Turístico</b> gratuito
          de 7 días lo evita (no aplica en contingencia).
        </p>
        <p>
          Valet sin costo según el listado del hotel; confirmar. Vie–dom, dejar
          el auto y usar Metro.
        </p>
        <div className="icon-links">
          <External href={driveSources.pase}>Pase Turístico</External>
          <External href={driveSources.hoyNoCircula}>Hoy No Circula</External>
        </div>
      </details>
    </section>
  );
}

function TravelerForm({
  trip,
  save,
}: {
  trip: Trip;
  save: (trip: Trip) => void;
}) {
  const [draft, setDraft] = useState<Trip>(() => ({
    ...trip,
    travelers: trip.travelers.length
      ? trip.travelers
      : [
          { initials: "", name: "", room: "shared" },
          { initials: "", name: "", room: "solo" },
          { initials: "", name: "", room: "shared" },
        ],
  }));
  const [error, setError] = useState("");
  return (
    <form
      className="traveler-form"
      onSubmit={(e) => {
        e.preventDefault();
        const result = tripSchema.safeParse({
          ...trip,
          travelers: draft.travelers,
          arrival: draft.arrival,
          football: draft.football,
          drive: draft.drive,
        });
        if (result.success) save(result.data);
        else
          setError(
            "Completa nombres e iniciales únicas de hasta 5 letras y, si hay parada, su nombre y dirección.",
          );
      }}
    >
      {draft.travelers.map((p, i) => (
        <fieldset key={i}>
          <legend>Viajero {i + 1}</legend>
          <label>
            Iniciales
            <input
              required
              maxLength={5}
              value={p.initials}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  travelers: draft.travelers.map((v, j) =>
                    j === i ? { ...v, initials: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <label>
            Nombre completo
            <input
              required
              maxLength={100}
              value={p.name}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  travelers: draft.travelers.map((v, j) =>
                    j === i ? { ...v, name: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <label>
            Habitación
            <select
              value={p.room}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  travelers: draft.travelers.map((v, j) =>
                    j === i
                      ? { ...v, room: e.target.value as "solo" | "shared" }
                      : v,
                  ),
                })
              }
            >
              <option value="solo">Individual</option>
              <option value="shared">Compartida</option>
            </select>
          </label>
        </fieldset>
      ))}
      <label>
        Llegada prevista
        <input
          maxLength={120}
          value={draft.arrival}
          onChange={(e) => setDraft({ ...draft, arrival: e.target.value })}
        />
      </label>
      <fieldset>
        <legend>Llegada en auto (opcional)</legend>
        <label>
          Salimos desde
          <input
            maxLength={120}
            placeholder="Ciudad de origen"
            value={draft.drive.origin}
            onChange={(e) =>
              setDraft({
                ...draft,
                drive: { ...draft.drive, origin: e.target.value },
              })
            }
          />
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={!!draft.drive.stop}
            onChange={(e) =>
              setDraft({
                ...draft,
                drive: {
                  ...draft.drive,
                  stop: e.target.checked
                    ? { label: "", address: "", window: "", note: "" }
                    : null,
                },
              })
            }
          />
          Parada antes o después del check-in
        </label>
        {draft.drive.stop &&
          (
            [
              ["label", "Nombre de la parada", 80],
              ["address", "Dirección para Maps", 160],
              ["window", "Horario de atención", 80],
              ["note", "Qué hay que hacer", 200],
            ] as const
          ).map(([key, label, max]) => (
            <label key={key}>
              {label}
              <input
                required={key === "label" || key === "address"}
                maxLength={max}
                value={draft.drive.stop![key]}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    drive: {
                      ...draft.drive,
                      stop: { ...draft.drive.stop!, [key]: e.target.value },
                    },
                  })
                }
              />
            </label>
          ))}
      </fieldset>
      <label>
        Equipos o ligas que queremos ver
        <input
          maxLength={150}
          value={draft.football}
          onChange={(e) => setDraft({ ...draft, football: e.target.value })}
        />
      </label>
      <p role="alert">{error}</p>
      <button className="button primary">Guardar viajeros</button>
    </form>
  );
}

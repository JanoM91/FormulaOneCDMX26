"use client";
import { useState } from "react";
import {
  BedDouble,
  Hotel,
  MapPin,
  TrainFront,
  Car,
  Utensils,
  Users,
  Upload,
  Check,
  ArrowRight,
} from "lucide-react";
import type { Day, Preferences } from "@/lib/types";
import { days } from "@/lib/content";
import { tripImportSchema, tripSchema } from "@/lib/preferences";
import {
  driveSources,
  hotel,
  mapRoute,
  places,
  travelSources,
} from "@/lib/travel";
import { External, Heading, Notice } from "./primitives";
type Trip = Preferences["trip"];
export function TravelPanel({
  trip,
  save,
  day,
  setDay,
}: {
  trip: Trip;
  save: (t: Trip) => void;
  day: Day;
  setDay: (d: Day) => void;
}) {
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const destination = `${days[day].gate}, Autódromo Hermanos Rodríguez, Ciudad de México`;
  async function importTrip(file?: File) {
    if (!file) return;
    try {
      if (file.size > 20000) throw new Error();
      const result = tripImportSchema.parse(JSON.parse(await file.text()));
      save(result.trip);
      setEditing(false);
      setMessage("Viaje importado. Solo se guarda en este teléfono.");
    } catch {
      setMessage(
        "Archivo no válido. Elige el archivo privado del viaje; no se cambió lo que tenías guardado.",
      );
    }
  }
  return (
    <div className="travel-panel">
      <div className="travel-title">
        <span className="eyebrow">29 OCT — 01 NOV / CIUDAD DE MÉXICO</span>
        <h1>
          Fuera de pista.
          <br />
          <em>También juntos.</em>
        </h1>
        <p>La base, el camino y el plan para cerrar cada día.</p>
      </div>
      <div className="travel-links">
        {[
          ["hotel", "01 / Hospedaje"],
          ["equipo", "02 / Nosotros"],
          ["traslados", "03 / Traslados"],
          ["cena", "04 / Cena y futbol"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() =>
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "instant" })
            }
          >
            {label}
          </button>
        ))}
      </div>
      <section id="hotel" className="hotel-card card">
        <div className="hotel-heading">
          <Hotel size={30} />
          <span className="eyebrow">NUESTRA BASE / NÁPOLES</span>
        </div>
        <h2>{hotel.name}</h2>
        <p>
          <MapPin size={16} /> {hotel.address}
        </p>
        <div className="stay-dates">
          <div>
            <span>CHECK-IN / JUE 29 OCT</span>
            <strong>15:00</strong>
            <small>Desde esta hora · llegada por la tarde</small>
          </div>
          <div>
            <span>CHECK-OUT / DOM 01 NOV</span>
            <strong>12:00</strong>
            <small>Resolver antes de salir hacia la carrera</small>
          </div>
        </div>
        <p className="small muted">
          Fechas y horas de la reserva proporcionada. Dos habitaciones;
          categoría indicada: Suite junior. Confirma en recepción la categoría
          de ambas y los servicios incluidos.
        </p>
        <div className="button-row">
          <External
            className="button primary"
            href={mapRoute(hotel.destination, "driving")}
          >
            Llegar al hotel en Google Maps
          </External>
          <External
            className="button secondary"
            href={mapRoute(hotel.destination, "transit")}
          >
            Llegar en transporte público
          </External>
          <External href={hotel.url}>Sitio del hotel</External>
        </div>
      </section>
      <section id="equipo" className="card">
        <Heading eyebrow="EL EQUIPO DEL FIN DE SEMANA" title="Nosotros tres">
          <Users />
        </Heading>
        {trip.travelers.length ? (
          <div className="traveler-grid">
            {trip.travelers.map((p) => (
              <article key={p.initials} className="traveler">
                <span className="avatar">{p.initials}</span>
                <h3>{p.name}</h3>
                <p>
                  {p.room === "solo"
                    ? "Habitación individual"
                    : "Habitación compartida"}
                </p>
                <strong>Cuarto {trip.rooms[p.room] || "por asignar"}</strong>
              </article>
            ))}
          </div>
        ) : (
          <p>
            Importa el archivo privado para ver los nombres y la distribución de
            habitaciones, o captúralos aquí.
          </p>
        )}
        <div className="button-row">
          <label className="import-button">
            <Upload size={18} /> Importar nuestro viaje
            <span className="import-hint">
              Toca para elegir el archivo .json que te compartieron
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
            {editing ? "Cerrar edición" : "Editar viajeros y preferencias"}
          </button>
        </div>
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
        <p className="small muted">
          Nombres, cuartos y preferencias viven solo en este navegador. No se
          sincronizan entre teléfonos ni se incluyen en enlaces de Maps.
        </p>
        <p role="status" className="save-status">
          {message}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMessage("Check-in y cuartos guardados en este teléfono.");
          }}
        >
          <h3>
            <BedDouble size={22} /> Al hacer check-in
          </h3>
          <div className="room-grid">
            {(["solo", "shared"] as const).map((room) => (
              <label key={room}>
                {room === "solo" ? "Cuarto individual" : "Cuarto compartido"}
                <small>
                  {trip.travelers
                    .filter((p) => p.room === room)
                    .map((p) => p.initials)
                    .join(" + ") || "Sin viajeros asignados"}
                </small>
                <input
                  aria-label={
                    room === "solo"
                      ? "Número de cuarto individual"
                      : "Número de cuarto compartido"
                  }
                  maxLength={20}
                  placeholder="Por asignar en recepción"
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
            Consigna del domingo confirmada con recepción
            <input
              type="checkbox"
              checked={trip.luggage}
              onChange={(e) => save({ ...trip, luggage: e.target.checked })}
            />
          </label>
          <button className="button primary" type="submit">
            <Check size={17} /> Guardar check-in
          </button>
        </form>
      </section>
      <section className="card">
        <Heading eyebrow="EL VIAJE EMPIEZA EL JUEVES" title="Nuestro plan" />
        <ol className="trip-timeline">
          {trip.drive.origin && (
            <li>
              <time>JUE 29 · TEMPRANO</time>
              <div>
                <h3>Carretera desde {trip.drive.origin}</h3>
                <p>
                  Salir con margen. Llevar el Pase Turístico impreso si el auto
                  tiene placas de otro estado y revisar el tráfico al entrar a
                  la ciudad.
                </p>
              </div>
            </li>
          )}
          {trip.drive.stop && (
            <li>
              <time>
                JUE 29 · {trip.drive.stop.window || "ANTES DEL HOTEL"}
              </time>
              <div>
                <h3>{trip.drive.stop.label}</h3>
                <p>
                  {trip.drive.stop.note ||
                    "Parada pendiente antes o después del check-in."}
                </p>
              </div>
            </li>
          )}
          <li>
            <time>JUE 29 · TARDE</time>
            <div>
              <h3>Llegar, dejar maletas y bajar el ritmo</h3>
              <p>
                {trip.arrival}. Check-in desde las 15:00. Capturar los cuartos,
                acordar un punto de reunión y cargar saldo de transporte.
              </p>
            </div>
          </li>
          <li>
            <time>JUE 29 · 19:00</time>
            <div>
              <h3>Primera cena en Nápoles</h3>
              <p>
                Hora sugerida, ajustable a la llegada. Elegir mesa y confirmar
                el partido si quieren ver futbol.
              </p>
            </div>
          </li>
          <li>
            <time>VIE + SÁB</time>
            <div>
              <h3>Desayuno, ruta y pista</h3>
              <p>
                Consulta la agenda y el acceso del día antes de salir. Al
                regreso, revisar el cierre de cocina antes de elegir dónde
                cenar.
              </p>
            </div>
          </li>
          <li>
            <time>DOM 01 · ANTES DE SALIR</time>
            <div>
              <h3>Check-out y equipaje resueltos</h3>
              <p>
                La salida vence a las 12:00, durante el programa del autódromo.
                Hacer check-out antes de ir; la consigna o una salida tardía
                requieren confirmación del hotel. No llevar maletas al circuito.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section id="traslados">
        <Heading eyebrow="DEL HOTEL A LA EMOCIÓN" title="Cómo nos movemos" />
        <DriveCard trip={trip} />
        <label className="route-day">
          Destino del día
          <select value={day} onChange={(e) => setDay(e.target.value as Day)}>
            {(Object.keys(days) as Day[]).map((d) => (
              <option key={d} value={d}>
                {days[d].label} · {days[d].gate}
              </option>
            ))}
          </select>
        </label>
        {day === "saturday" && (
          <Notice>
            El sábado usa Boxes Oro Sur y la Puerta 2 indicada en tu boleto.
            Confirma con el organizador: no es el acceso de viernes y domingo.
          </Notice>
        )}
        <div className="two-columns">
          <article className="card">
            <h3>
              <TrainFront size={22} /> Metrobús + Metro
            </h3>
            <p className="route-badge">
              L1 roja <ArrowRight size={15} /> L9 café
            </p>
            <ol className="route-steps">
              <li>
                Camina del hotel a{" "}
                <strong>Metrobús Ciudad de los Deportes</strong> sobre
                Insurgentes. Confirma en Maps el acceso peatonal.
              </li>
              <li>
                Toma Línea 1 hacia el norte, con destino{" "}
                <strong>Indios Verdes o Buenavista</strong>, y baja en{" "}
                <strong>Chilpancingo</strong>. Revisa el letrero del autobús.
              </li>
              <li>
                Sal de Metrobús y entra a{" "}
                <strong>Metro Chilpancingo, Línea 9 dirección Pantitlán</strong>
                . Son sistemas distintos y se paga cada ingreso.
              </li>
              <li>
                Baja en <strong>Ciudad Deportiva o Puebla</strong> para orientar
                el acceso al complejo; la estación y caminata final dependen de
                la puerta. Consulta la ruta de abajo y el mapa oficial del
                evento.
              </li>
            </ol>
            <p>
              Regreso: Línea 9 hacia <strong>Tacubaya</strong> hasta
              Chilpancingo; Metrobús L1 hacia{" "}
              <strong>El Caminero o Doctor Gálvez</strong> hasta Ciudad de los
              Deportes.
            </p>
            <div className="link-list">
              <External
                href={mapRoute(
                  "Metrobús Ciudad de los Deportes, Ciudad de México",
                  "walking",
                  hotel.destination,
                )}
              >
                Caminar a la estación
              </External>
              <External
                href={mapRoute(destination, "transit", hotel.destination)}
              >
                Ruta completa a {days[day].gate}
              </External>
              <External href={travelSources.line9}>
                Mapa oficial de Metro L9
              </External>
              <External href={travelSources.line1}>
                Estaciones de Metrobús L1
              </External>
            </div>
          </article>
          <article className="card">
            <h3>
              <Car size={22} /> Uber o taxi de sitio
            </h3>
            <p>
              Desde el hotel, selecciona la puerta del día como destino y revisa
              el punto que permite la app. Los cierres del evento pueden exigir
              caminar el último tramo.
            </p>
            <p>
              Al regreso acuerden un punto permitido fuera del cierre vial.
              Comparen tarifa y espera antes de confirmar el viaje. No se
              solicita ningún coche desde esta guía.
            </p>
            <div className="link-list">
              <External
                href={mapRoute(destination, "driving", hotel.destination)}
              >
                Ver recorrido en coche
              </External>
              <External href="https://m.uber.com/">
                Abrir Uber y cotizar
              </External>
              <External href={mapRoute(hotel.destination, "driving")}>
                Regresar al Hotel Beverly
              </External>
              <External href="https://www.mexicogp.mx/mapa-de-accesos/">
                Accesos oficiales del evento
              </External>
            </div>
            <p className="small muted">
              Tiempos y precios dependen del tráfico y la demanda. Maps calcula
              la ruta al abrirlo; no garantizamos acceso vehicular hasta la
              puerta.
            </p>
          </article>
        </div>
        <article className="card">
          <h3>Horarios y pago</h3>
          <div className="transport-hours">
            <div>
              <strong>Metro · $5 MXN / viaje</strong>
              <p>
                Lun–vie 05:00–00:00
                <br />
                Sábado 06:00–00:00
                <br />
                Domingo y festivos 07:00–00:00
              </p>
              <External href={travelSources.metro}>
                Horarios oficiales Metro
              </External>
            </div>
            <div>
              <strong>Metrobús · $6 MXN / viaje ordinario</strong>
              <p>
                Lun–sáb 04:30–00:00
                <br />
                Domingo y festivos 05:00–00:00
                <br />
                Las rutas específicas pueden variar.
              </p>
              <External href={travelSources.metrobus}>
                Horarios oficiales Metrobús
              </External>
              <br />
              <External href={travelSources.fare}>
                Tarifa y medios de pago
              </External>
            </div>
          </div>
          <p>
            Lleven una tarjeta de Movilidad Integrada por persona y saldo
            suficiente. Metro + Metrobús suma $11 por persona por sentido, sin
            incluir la compra de tarjeta.
          </p>
          <p className="small muted">
            Guía de ruta orientativa, contrastada con la red publicada el
            26-oct-2026. No informa el estado operativo en vivo. Revisa avisos
            de Metro y Metrobús antes de salir; no planees llegar al último
            servicio.
          </p>
        </article>
      </section>
      <section id="cena">
        <Heading eyebrow="EL TERCER TIEMPO" title="Cena y futbol por la zona">
          <Utensils />
        </Heading>
        <p>
          {trip.football
            ? `Queremos ver: ${trip.football}. `
            : "Todavía no elegimos equipo o partido. "}
          Confirma transmisión, audio y disponibilidad de mesa con el lugar.
          Estos horarios no son una cartelera de partidos.
        </p>
        <div className="dining-grid">
          {places.map((p) => (
            <article className="card dining-card" key={p.name}>
              <span className="eyebrow">{p.kind}</span>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p className="small">{p.hours}</p>
              <div className="link-list">
                <External
                  href={mapRoute(p.address, "walking", hotel.destination)}
                >
                  Cómo llegar desde el hotel
                </External>
                <External href={p.url}>Consultar lugar y menú</External>
                {p.phone && (
                  <a className="external" href={`tel:${p.phone}`}>
                    Llamar para confirmar
                  </a>
                )}
                {p.hoursUrl && (
                  <External href={p.hoursUrl}>Fuente del horario</External>
                )}
              </div>
              <p className="small muted">{p.source} · consultado 26-oct-2026</p>
            </article>
          ))}
        </div>
      </section>
    </div>
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

function DriveCard({ trip }: { trip: Trip }) {
  const { origin, stop } = trip.drive;
  if (!origin)
    return (
      <p className="small muted drive-hint">
        ¿Llegan en auto? Captura la ciudad de origen y cualquier parada en
        “Editar viajeros y preferencias” para ver la ruta completa.
      </p>
    );
  const waypoints = stop ? [stop.address] : [];
  return (
    <section className="card drive-card">
      <span className="eyebrow">JUEVES 29 · CARRETERA</span>
      <h3>
        <Car size={20} /> Llegada en auto
      </h3>
      <ol className="drive-flow">
        <li>
          <span>Salida</span>
          <strong>{origin}</strong>
        </li>
        {stop && (
          <li>
            <span>{stop.window || "Parada"}</span>
            <strong>{stop.label}</strong>
          </li>
        )}
        <li>
          <span>Check-in desde 15:00</span>
          <strong>{hotel.name}</strong>
        </li>
      </ol>
      <div className="button-row">
        <External
          className="button primary"
          href={mapRoute(hotel.destination, "driving", origin, waypoints)}
        >
          Ruta completa en Maps
        </External>
        {stop && (
          <>
            <External href={mapRoute(stop.address, "driving", origin)}>
              Directo a {stop.label}
            </External>
            <External
              href={mapRoute(hotel.destination, "driving", stop.address)}
            >
              De {stop.label} al hotel
            </External>
          </>
        )}
      </div>
      <div className="drive-notes">
        <p>
          <strong>Placas de otro estado.</strong> Sin holograma de la Ciudad de
          México, el Hoy No Circula restringe entre semana de 5:00 a 11:00,
          además de un día según la placa y los sábados. El Pase Turístico es
          gratuito, se tramita en línea con Llave CDMX y el de 7 días cubre de
          jueves a domingo. No vale si se declara contingencia ambiental.
        </p>
        <div className="link-list">
          <External href={driveSources.pase}>Pase Turístico oficial</External>
          <External href={driveSources.hoyNoCircula}>
            Consultar Hoy No Circula
          </External>
        </div>
        <p>
          <strong>Al llegar.</strong> El listado del hotel indica valet sin
          costo; confírmalo al reservar o en recepción. Viernes a domingo
          conviene dejar el auto y llegar al autódromo en Metro y Metrobús:
          habrá cierres viales.
        </p>
        <p className="small muted">
          Reglas consultadas el 26-oct-2026 en fuentes públicas; verifica en el
          sitio oficial antes de salir. Los tiempos de manejo los calcula Maps
          al abrir la ruta.
        </p>
      </div>
    </section>
  );
}

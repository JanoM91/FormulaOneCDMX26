"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  CloudSun,
  Home,
  MapPin,
  Radio,
  Settings,
  Ticket as TicketIcon,
  Trash2,
  Users,
  Wifi,
  WifiOff,
  X,
  BookOpen,
  Upload,
  LocateFixed,
  Share2,
  Hotel,
  Newspaper,
  Map as MapIcon,
  Flag,
  Timer,
  Image as ImageIcon,
  TrainFront,
} from "lucide-react";
import type {
  Day,
  Grid,
  Teams,
  Preferences,
  Section,
  Ticket,
  Weather,
} from "@/lib/types";
import {
  activities,
  days,
  directions,
  news,
  sources,
  ticketFor,
} from "@/lib/content";
import {
  activityState,
  clock,
  countdown,
  eventDay,
  nextActivity,
} from "@/lib/time";
import { ticketImportSchema, ticketSchema } from "@/lib/preferences";
import { usePreferences, useRemote } from "./hooks";
import { External, Fold, MediaFigure, Notice, Source } from "./primitives";
import { trackMedia } from "@/lib/media";
import { TravelPanel } from "./travel";
import { TimingPanel } from "./timing";
import { TrackMap } from "./track-map";
import { DriversPanel } from "./drivers-panel";
import { GuidePanel } from "./guide-panel";
import {
  DayTabs,
  TicketCard,
  ticketText,
  whatsapp,
  type TripDay,
} from "./shared";

const sections: { id: Section; label: string; icon: typeof Home }[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "viaje", label: "Viaje", icon: Hotel },
  { id: "live", label: "En pista", icon: Radio },
  { id: "pilotos", label: "Pilotos", icon: Users },
  { id: "mapa", label: "Mapa", icon: MapPin },
  { id: "guia", label: "Guía", icon: BookOpen },
];
const f1Days: Day[] = ["friday", "saturday", "sunday"];
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
function DayPicker({ day, setDay }: { day: Day; setDay: (d: Day) => void }) {
  return <DayTabs value={day} onChange={setDay} options={f1Days} />;
}
function tripDayFor(now: Date): TripDay {
  const local = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
  }).format(now);
  return local < "2026-10-30" ? "thursday" : eventDay(now);
}

export default function Companion() {
  const [section, setSection] = useState<Section>("inicio"),
    [day, setDay] = useState<Day>("friday"),
    [tripDay, setTripDay] = useState<TripDay>("thursday"),
    [now, setNow] = useState(() => new Date("2026-10-26T12:00:00-06:00")),
    [online, setOnline] = useState(true);
  const [settings, setSettings] = useState(false),
    [ticketEditor, setTicketEditor] = useState(false),
    [install, setInstall] = useState<InstallEvent | null>(null),
    [offlineReady, setOfflineReady] = useState(false),
    [notification, setNotification] = useState("");
  const [location, setLocation] = useState(""),
    [locating, setLocating] = useState(false),
    [showMap, setShowMap] = useState(false);
  const { prefs, update, ready, storageError, clear } = usePreferences();
  const weather = useRemote<Weather>(
    "/api/weather",
    600000,
    section === "inicio",
  );
  const grid = useRemote<Grid>("/api/grid", 900000, section === "pilotos");
  const teams = useRemote<Teams>("/api/teams", 900000, section === "pilotos");
  const dialog = useRef<HTMLDialogElement>(null),
    editor = useRef<HTMLDialogElement>(null),
    main = useRef<HTMLElement>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    setDay(eventDay(new Date()));
    setTripDay(tripDayFor(new Date()));
    const timer = setInterval(tick, 1000);
    const connection = () => setOnline(navigator.onLine);
    connection();
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    const hash = () => {
      let value = window.location.hash.slice(1);
      if (value === "fin-de-semana") value = "viaje";
      if (sections.some((s) => s.id === value)) setSection(value as Section);
    };
    hash();
    window.addEventListener("hashchange", hash);
    const prompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", prompt);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then(() => setOfflineReady(true))
        .catch(() =>
          setNotification(
            "No se pudo preparar el modo offline. Abre la app con conexión.",
          ),
        );
    }
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("beforeinstallprompt", prompt);
    };
  }, []);
  useEffect(() => {
    if (settings) dialog.current?.showModal();
    else dialog.current?.close();
  }, [settings]);
  useEffect(() => {
    if (ticketEditor) editor.current?.showModal();
    else editor.current?.close();
  }, [ticketEditor]);
  const navigate = (s: Section) => {
    setSection(s);
    window.location.hash = s;
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => main.current?.focus());
  };
  const next = nextActivity(activities, now),
    today = eventDay(now),
    currentTicket = ticketFor(day, prefs.tickets);
  const change = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    update((p) => ({ ...p, [key]: value }));
  async function importTickets(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 20000) throw new Error();
      const result = ticketImportSchema.parse(JSON.parse(await file.text()));
      change("tickets", result.tickets);
      setNotification("Asientos guardados en este teléfono.");
      setTicketEditor(false);
    } catch {
      setNotification("No se pudo importar el archivo de asientos.");
    }
  }
  async function installApp() {
    if (install) {
      await install.prompt();
      await install.userChoice;
      setInstall(null);
    } else
      setNotification(
        "iPhone: Compartir → Añadir a pantalla de inicio. Android: menú → Instalar aplicación.",
      );
  }
  function locate() {
    if (!navigator.geolocation) {
      setNotification("Tu navegador no permite consultar ubicación.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocation(
          `https://www.google.com/maps/search/?api=1&query=${p.coords.latitude},${p.coords.longitude}`,
        );
        setLocating(false);
        setNotification(
          `Ubicación lista (±${Math.round(p.coords.accuracy)} m).`,
        );
      },
      () => {
        setLocating(false);
        setNotification("No pudimos obtener tu ubicación. Revisa permisos.");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 },
    );
  }
  const upcoming = next && new Date(next.start) > now;
  return (
    <div
      className={`app theme-${prefs.theme} ${prefs.contrast ? "high-contrast" : ""} ${prefs.easy ? "easy-reading" : ""}`}
    >
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate("inicio")}
          aria-label="México 26, inicio"
        >
          <span className="brand-mark">
            M<span>26</span>
          </span>
          <span>
            MÉXICO <b>26</b>
            <small>NUESTRO FIN DE SEMANA</small>
          </span>
        </button>
        <div className="topbar-right">
          <span
            className="connection"
            aria-label={online ? "Con conexión" : "Sin conexión"}
          >
            {online ? <Wifi size={15} /> : <WifiOff size={15} />}
          </span>
          <button
            className="icon-button"
            aria-label="Abrir ajustes"
            onClick={() => setSettings(true)}
          >
            <Settings size={21} />
          </button>
        </div>
      </header>
      <div className="desktop-nav">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(s.id)}
            aria-current={section === s.id ? "page" : undefined}
          >
            <s.icon size={18} />
            {s.label}
          </button>
        ))}
      </div>
      <main id="main" ref={main} tabIndex={-1}>
        {!online && (
          <Notice>
            Sin conexión: agenda, asientos y guía siguen disponibles.
          </Notice>
        )}
        {storageError && <Notice>{storageError}</Notice>}

        {section === "inicio" && (
          <div className="stack">
            <section className="home-hero">
              {trackMedia.hero && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="home-hero-img"
                  src={trackMedia.hero.src}
                  alt={trackMedia.hero.alt}
                  width={trackMedia.hero.width}
                  height={trackMedia.hero.height}
                />
              )}
              <div className="home-hero-copy">
                <span className="eyebrow">30 OCT — 01 NOV · CDMX</span>
                <h1>
                  Una gran <em>F1ESTA.</em>
                </h1>
              </div>
            </section>
            <section className="next-card">
              <span className="live-label">
                <span />
                {next ? activityState(next, now) : "Finalizado"}
              </span>
              <h2>{next?.name ?? "Gracias por vivirlo juntos"}</h2>
              {next && (
                <p>
                  {days[next.day].label} · {clock(next.start)}–{clock(next.end)}
                </p>
              )}
              {upcoming && (
                <div className="countdown">{countdown(next.start, now)}</div>
              )}
            </section>
            <TicketCard day={today} prefs={prefs} />
            <div className="quick-grid4">
              <button onClick={() => navigate("viaje")}>
                <Hotel />
                <span>Viaje</span>
              </button>
              <button onClick={() => navigate("live")}>
                <Flag />
                <span>Pista</span>
              </button>
              <button onClick={() => navigate("mapa")}>
                <Users />
                <span>Encontrarnos</span>
              </button>
              <button onClick={() => navigate("guia")}>
                <BookOpen />
                <span>Datos</span>
              </button>
            </div>
            <Fold
              icon={<CloudSun />}
              title="Clima"
              hint={
                weather.data
                  ? `${Math.round(weather.data.temperature)}° ahora · sensación ${Math.round(weather.data.apparent)}°`
                  : weather.loading
                    ? "Consultando…"
                    : "Pendiente"
              }
            >
              {weather.data ? (
                <>
                  <div className="forecast">
                    {weather.data.daily.slice(0, 7).map((d) => (
                      <div key={d.date}>
                        <span>
                          {d.date.slice(8)}/{d.date.slice(5, 7)}
                        </span>
                        <strong>{Math.round(d.max)}°</strong>
                        <span>
                          {Math.round(d.min)}° · {d.rain}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <Source
                    meta={weather.data.meta}
                    now={now}
                    offline={!online || !!weather.error}
                  />
                </>
              ) : (
                <p>
                  {weather.error ??
                    "Se mostrará al recibir datos de Open-Meteo."}
                </p>
              )}
            </Fold>
            <Fold
              icon={<Newspaper />}
              title="Antes de la bandera verde"
              hint={`${news.length} avisos`}
            >
              <ul className="news-list">
                {news.map((n) => (
                  <li key={n.title}>
                    <details className="more">
                      <summary>
                        <span className="pill">{n.kind}</span> {n.title}
                      </summary>
                      <p>{n.summary}</p>
                      <External href={n.url}>Fuente</External>
                    </details>
                  </li>
                ))}
              </ul>
            </Fold>
          </div>
        )}

        {section === "viaje" && (
          <TravelPanel
            prefs={prefs}
            save={(trip) => change("trip", trip)}
            changeNotes={(d, v) => change("notes", { ...prefs.notes, [d]: v })}
            tripDay={tripDay}
            setTripDay={setTripDay}
            now={now}
          />
        )}

        {section === "live" && (
          <>
            <div className="page-title">
              <h1>En pista</h1>
            </div>
            <DayPicker day={day} setDay={setDay} />
            <TrackMap selected={day} onSelect={setDay} />
            <TicketCard day={day} prefs={prefs} />
            <Fold
              icon={<Timer />}
              title="Live timing"
              hint="Posiciones durante la sesión"
              open
            >
              <TimingPanel now={now} online={online} prefs={prefs} />
            </Fold>
          </>
        )}

        {section === "pilotos" && (
          <DriversPanel
            prefs={prefs}
            setFavorite={(n) => change("favorite", n)}
            grid={grid.data}
            teams={teams.data}
          />
        )}

        {section === "mapa" && (
          <div className="stack">
            <div className="page-title">
              <h1>Mapa</h1>
            </div>
            <DayPicker day={day} setDay={setDay} />
            <div className="route-chips">
              <span style={{ "--c": days[day].color } as React.CSSProperties}>
                Zona {days[day].zone}
              </span>
              <ArrowRight size={16} />
              <span>
                {days[day].gate.replace(" del Palacio de los Deportes", "")}
              </span>
              <ArrowRight size={16} />
              <span>{days[day].venue}</span>
            </div>
            <div className="button-row">
              <External className="button primary" href={directions(day)}>
                <MapPin size={17} /> Llévame
              </External>
              <button
                className="button secondary"
                onClick={locate}
                disabled={locating}
              >
                <LocateFixed size={18} />
                {locating ? "Buscando…" : "Estoy aquí"}
              </button>
            </div>
            {location && (
              <div className="location-result">
                <External href={location}>Ver mi ubicación</External>
                <External
                  href={whatsapp(
                    `Estoy aquí: ${location}\n${ticketText(day, currentTicket, prefs.meeting)}`,
                  )}
                >
                  Compartir al grupo
                </External>
              </div>
            )}
            <Fold
              icon={<Users />}
              title="Si nos separamos"
              hint={prefs.meeting || "Definir punto de reunión"}
            >
              <textarea
                aria-label="Punto de reunión"
                maxLength={300}
                placeholder="Un lugar visible dentro de la zona y una hora."
                value={prefs.meeting}
                onChange={(e) => change("meeting", e.target.value)}
              />
              <pre className="share-preview">
                {ticketText(day, currentTicket, prefs.meeting)}
              </pre>
              <External
                className="button primary"
                href={whatsapp(ticketText(day, currentTicket, prefs.meeting))}
              >
                <Share2 size={16} /> WhatsApp
              </External>
            </Fold>
            <Fold
              icon={<MapIcon />}
              title="Mapas oficiales"
              hint="Accesos y servicios"
            >
              <div className="icon-links">
                <External className="chip" href={sources.map}>
                  Servicios
                </External>
                <External className="chip" href={sources.access}>
                  Accesos
                </External>
              </div>
              {showMap && online ? (
                <iframe
                  className="map-embed"
                  title="Mapa del entorno del Autódromo Hermanos Rodríguez, OpenStreetMap"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-99.113%2C19.392%2C-99.078%2C19.416&layer=mapnik&marker=19.4042%2C-99.0907"
                />
              ) : (
                <button
                  className="button secondary"
                  onClick={() => setShowMap(true)}
                  disabled={!online}
                >
                  <MapPin size={18} /> Cargar mapa del entorno
                </button>
              )}
            </Fold>
            <Fold icon={<ImageIcon />} title="La pista desde arriba">
              {trackMedia.aerial && <MediaFigure media={trackMedia.aerial} />}
              {trackMedia.layout && (
                <MediaFigure
                  className="track-layout"
                  media={trackMedia.layout}
                />
              )}
              <p className="fine">
                El diagrama marca zonas DRS de 2022; en 2026 hay aerodinámica
                activa.
              </p>
            </Fold>
            <Fold
              icon={<TrainFront />}
              title="Transporte"
              hint="Metro L9 · Metrobús L1"
            >
              <p>
                Estaciones Velódromo, Ciudad Deportiva y Puebla según la zona.
                No cuentes con estacionamiento.
              </p>
              <div className="icon-links">
                <External
                  className="chip"
                  href="https://www.metro.cdmx.gob.mx/"
                >
                  Metro
                </External>
                <External
                  className="chip"
                  href="https://www.metrobus.cdmx.gob.mx/"
                >
                  Metrobús
                </External>
                <External
                  className="chip"
                  href="https://guias.ticketmaster.com.mx/ticket2ride/gran-premio-de-la-ciudad-de-mexico/"
                >
                  Ticket2Ride
                </External>
              </div>
            </Fold>
          </div>
        )}

        {section === "guia" && (
          <GuidePanel
            prefs={prefs}
            update={update}
            install={installApp}
            offlineReady={offlineReady}
          />
        )}

        <footer>
          <span className="brand-mini">MÉXICO 26</span>
          <span>
            {ready && offlineReady ? (
              <>
                <CheckCheck size={14} /> Lista sin conexión
              </>
            ) : (
              "Preparando"
            )}{" "}
            · Horarios CDMX · Sin afiliación con F1, FIA o MéxicoGP
          </span>
        </footer>
      </main>
      <nav className="bottom-nav" aria-label="Navegación principal">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(s.id)}
            aria-current={section === s.id ? "page" : undefined}
          >
            <s.icon size={21} />
            <span>{s.label}</span>
          </button>
        ))}
      </nav>
      <div className="toast" role="status" aria-live="polite">
        {notification && (
          <>
            <span>{notification}</span>
            <button
              aria-label="Cerrar aviso"
              onClick={() => setNotification("")}
            >
              <X size={18} />
            </button>
          </>
        )}
      </div>
      <dialog
        ref={dialog}
        onClose={() => setSettings(false)}
        onCancel={() => setSettings(false)}
      >
        <div className="dialog-heading">
          <h2>A tu manera</h2>
          <button
            className="icon-button"
            aria-label="Cerrar ajustes"
            onClick={() => setSettings(false)}
          >
            <X />
          </button>
        </div>
        <p>Una experiencia cómoda, incluso bajo el sol.</p>
        <label className="toggle">
          <span>Alto contraste</span>
          <input
            type="checkbox"
            checked={prefs.contrast}
            onChange={(e) => change("contrast", e.target.checked)}
          />
        </label>
        <label className="toggle">
          <span>Lectura fácil · texto más grande</span>
          <input
            type="checkbox"
            checked={prefs.easy}
            onChange={(e) => change("easy", e.target.checked)}
          />
        </label>
        <label>
          Estilo visual
          <select
            value={prefs.theme}
            onChange={(e) =>
              change("theme", e.target.value as Preferences["theme"])
            }
          >
            <option value="paddock">México 2026 · verde, negro y rojo</option>
            <option value="fiesta">México de fiesta · rojo y dorado</option>
            <option value="telemetry">Centro de carrera · azul y blanco</option>
          </select>
        </label>
        <h3>Privacidad en tu teléfono</h3>
        <p>
          Viajeros, cuartos, asientos, notas, favorito y checklist se almacenan
          en este navegador. No se sincronizan ni se envían a un servidor. La
          ubicación solo se consulta al tocar “Estoy aquí”.
        </p>
        <button
          className="button secondary"
          onClick={() => {
            setSettings(false);
            setTicketEditor(true);
          }}
        >
          <TicketIcon size={18} /> Configurar asientos
        </button>
        <button
          className="button danger"
          onClick={() => {
            if (
              window.confirm(
                "¿Borrar tus viajeros, cuartos, asientos, notas, checklist y preferencias de este teléfono?",
              )
            ) {
              clear();
              setLocation("");
              setNotification("Datos personales borrados de este teléfono.");
            }
          }}
        >
          <Trash2 size={17} /> Borrar mis datos personales
        </button>
        <p className="small muted">
          Las páginas externas aplican sus propias políticas. No guardes códigos
          QR, cuentas ni datos de Ticketmaster.
        </p>
      </dialog>
      <dialog
        ref={editor}
        onClose={() => setTicketEditor(false)}
        onCancel={() => setTicketEditor(false)}
      >
        <div className="dialog-heading">
          <h2>Nuestros asientos</h2>
          <button
            className="icon-button"
            aria-label="Cerrar asientos"
            onClick={() => setTicketEditor(false)}
          >
            <X />
          </button>
        </div>
        <p>
          Se guardan solo en este teléfono. Importa el archivo privado o captura
          sección, fila y asientos.
        </p>
        <label className="import-button">
          <Upload size={19} /> Importar archivo privado
          <span className="import-hint">
            Toca para elegir el archivo .json de asientos
          </span>
          <input
            aria-label="Importar archivo privado de asientos"
            type="file"
            accept="application/json,.json"
            onChange={(e) => void importTickets(e.target.files?.[0])}
          />
        </label>
        <DayPicker day={day} setDay={setDay} />
        <TicketForm
          key={`${day}-${currentTicket?.section ?? ""}`}
          day={day}
          initial={currentTicket}
          save={(t) => {
            change("tickets", [
              ...prefs.tickets.filter((x) => x.day !== day),
              t,
            ]);
            setNotification(
              `Asientos del ${days[day].label.toLowerCase()} guardados en este teléfono.`,
            );
            setTicketEditor(false);
          }}
        />
        <p className="small muted">
          No adjuntes boletos, imágenes, códigos QR ni información de tu cuenta.
          El archivo se procesa localmente.
        </p>
      </dialog>
    </div>
  );
}
function TicketForm({
  day,
  initial,
  save,
}: {
  day: Day;
  initial?: Ticket;
  save: (t: Ticket) => void;
}) {
  const [section, setSection] = useState(initial?.section ?? ""),
    [row, setRow] = useState(initial?.row ?? ""),
    [seats, setSeats] = useState(initial?.seats ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const result = ticketSchema.safeParse({ day, section, row, seats });
        if (result.success) save(result.data);
      }}
    >
      <label>
        Sección
        <input
          required
          maxLength={24}
          value={section}
          onChange={(e) => setSection(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label>
        Fila
        <input
          required
          maxLength={12}
          value={row}
          onChange={(e) => setRow(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label>
        Asientos
        <input
          required
          maxLength={60}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          placeholder="Por ejemplo: 1, 2 y 3"
          autoComplete="off"
        />
      </label>
      <button className="button primary" type="submit">
        <Check size={18} /> Guardar en este teléfono
      </button>
    </form>
  );
}

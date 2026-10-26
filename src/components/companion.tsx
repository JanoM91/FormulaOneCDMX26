"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  CloudSun,
  Download,
  Flag,
  Heart,
  Home,
  MapPin,
  Navigation,
  Radio,
  Settings,
  ShieldCheck,
  Ticket as TicketIcon,
  Trash2,
  Users,
  Wifi,
  WifiOff,
  X,
  BookOpen,
  Sun,
  Upload,
  LocateFixed,
  Share2,
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
  checklist,
  days,
  defaultPreferences,
  directions,
  drivers,
  lessons,
  news,
  sources,
  teamColors,
  verifiedAt,
} from "@/lib/content";
import {
  activityState,
  clock,
  countdown,
  eventDay,
  fullTime,
  nextActivity,
} from "@/lib/time";
import { ticketImportSchema, ticketSchema } from "@/lib/preferences";
import { usePreferences, useRemote } from "./hooks";
import { External, Heading, Notice, Source } from "./primitives";
import { TimingPanel } from "./timing";

const sections: { id: Section; label: string; icon: typeof Home }[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "fin-de-semana", label: "Mi finde", icon: CalendarDays },
  { id: "live", label: "En pista", icon: Radio },
  { id: "pilotos", label: "Pilotos", icon: Users },
  { id: "mapa", label: "Mapa", icon: MapPin },
  { id: "guia", label: "Guía", icon: BookOpen },
];
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
function DayPicker({ day, setDay }: { day: Day; setDay: (d: Day) => void }) {
  return (
    <div className="day-picker" aria-label="Día del fin de semana">
      {(Object.keys(days) as Day[]).map((d) => (
        <button key={d} aria-pressed={day === d} onClick={() => setDay(d)}>
          <span>{days[d].label}</span>
          <strong>{days[d].short}</strong>
          <i style={{ background: days[d].color }} />
        </button>
      ))}
    </div>
  );
}
function ticketText(day: Day, ticket: Ticket | undefined, meeting: string) {
  const d = days[day];
  return `Si nos separamos:\nDía: ${d.label} ${d.date}\nZona: ${d.zone}\nPuerta: ${d.gate}\nSección: ${ticket?.section ?? "Pendiente"}\nFila: ${ticket?.row ?? "Pendiente"}\nAsientos: ${ticket?.seats ?? "Pendientes"}${meeting ? `\nPunto de reunión: ${meeting}` : ""}`;
}
function whatsapp(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
function TicketCard({
  day,
  prefs,
  edit,
  compact = false,
}: {
  day: Day;
  prefs: Preferences;
  edit: () => void;
  compact?: boolean;
}) {
  const d = days[day],
    ticket = prefs.tickets.find((t) => t.day === day);
  return (
    <section
      className={`ticket-card ${compact ? "compact" : ""}`}
      style={{ "--zone": d.color } as React.CSSProperties}
    >
      <div className="ticket-top">
        <span className="eyebrow">
          <TicketIcon size={15} /> Nuestros boletos
        </span>
        <span className="zone-tag">Zona {d.zone}</span>
      </div>
      <h3>{d.venue}</h3>
      <p className="ticket-date">
        {d.label} · {d.date} de 2026
      </p>
      <div className="ticket-seats">
        <div>
          <span>Sección</span>
          <strong>{ticket?.section ?? "—"}</strong>
        </div>
        <div>
          <span>Fila</span>
          <strong>{ticket?.row ?? "—"}</strong>
        </div>
        <div>
          <span>Asientos</span>
          <strong>{ticket?.seats ?? "—"}</strong>
        </div>
      </div>
      {!ticket && (
        <button className="text-button" onClick={edit}>
          Guardar mis asientos en este teléfono <ChevronRight size={16} />
        </button>
      )}
      <div className="gate">
        <MapPin size={22} />
        <div>
          <span>Tu acceso</span>
          <strong>{d.gate}</strong>
        </div>
      </div>
      {day === "saturday" && (
        <Notice>
          <strong>Este acceso es distinto al del viernes y domingo.</strong>{" "}
          Puerta 2 según tu indicación de boleto. Confirma el acceso específico
          de Boxes Oro Sur con el organizador.
        </Notice>
      )}
      <div className="ticket-actions">
        <External href={directions(day)}>Cómo llegar a mi puerta</External>
        <External href={whatsapp(ticketText(day, ticket, prefs.meeting))}>
          <Share2 size={15} /> Si nos separamos
        </External>
      </div>
      <span className="small muted">
        Referencia personal · no sustituye tu boleto de entrada
      </span>
    </section>
  );
}
function CircuitArt() {
  return (
    <svg
      className="circuit-art"
      viewBox="0 0 560 260"
      role="img"
      aria-label="Ilustración decorativa inspirada en un circuito, no es un mapa de navegación"
    >
      <defs>
        <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path
            d="M 22 0 L 0 0 0 22"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            opacity=".18"
          />
        </pattern>
      </defs>
      <rect width="560" height="260" fill="url(#grid)" />
      <path
        d="M65 175 L440 175 Q490 175 485 130 L475 95 Q470 75 450 85 L420 110 L395 70 Q385 55 365 70 L335 95 L307 62 Q290 45 275 66 L245 113 Q232 133 210 115 L185 90 Q170 73 154 90 L126 122 Q112 138 94 123 L78 108 Q54 90 50 118 L47 149 Q45 175 65 175Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path d="M65 175 L440 175" stroke="#e35039" strokeWidth="9" />
      <circle
        cx="208"
        cy="175"
        r="9"
        fill="#f3cb6b"
        stroke="#172d2a"
        strokeWidth="4"
      />
      <text x="212" y="215" fill="currentColor" fontSize="10" letterSpacing="3">
        CIUDAD DE MÉXICO · 2026
      </text>
    </svg>
  );
}

export default function Companion() {
  const [section, setSection] = useState<Section>("inicio"),
    [day, setDay] = useState<Day>("friday"),
    [now, setNow] = useState(() => new Date("2026-10-26T12:00:00-06:00")),
    [online, setOnline] = useState(true);
  const [settings, setSettings] = useState(false),
    [ticketEditor, setTicketEditor] = useState(false),
    [install, setInstall] = useState<InstallEvent | null>(null),
    [offlineReady, setOfflineReady] = useState(false),
    [notification, setNotification] = useState("");
  const [location, setLocation] = useState(""),
    [locating, setLocating] = useState(false),
    [driverSearch, setDriverSearch] = useState(""),
    [teamView, setTeamView] = useState(false),
    [showMap, setShowMap] = useState(false);
  const { prefs, update, ready, storageError, clear } = usePreferences();
  const weather = useRemote<Weather>(
    "/api/weather",
    600000,
    section === "inicio",
  );
  const grid = useRemote<Grid>("/api/grid", 900000, section === "pilotos");
  const teams = useRemote<Teams>(
    "/api/teams",
    900000,
    section === "pilotos" && teamView,
  );
  const dialog = useRef<HTMLDialogElement>(null),
    editor = useRef<HTMLDialogElement>(null),
    main = useRef<HTMLElement>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    setDay(eventDay(new Date()));
    const timer = setInterval(tick, 1000);
    const connection = () => setOnline(navigator.onLine);
    connection();
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    const hash = () => {
      const value = window.location.hash.slice(1);
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
            "No se pudo preparar el modo offline. Abre la app con conexión e inténtalo de nuevo.",
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
    currentTicket = prefs.tickets.find((t) => t.day === day);
  const change = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    update((p) => ({ ...p, [key]: value }));
  async function importTickets(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 20000) throw new Error();
      const result = ticketImportSchema.parse(JSON.parse(await file.text()));
      change("tickets", result.tickets);
      setNotification("Asientos guardados solo en este teléfono.");
      setTicketEditor(false);
    } catch {
      setNotification(
        "No se pudo importar. Usa el archivo privado de asientos en formato JSON.",
      );
    }
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
          `Ubicación lista, precisión aproximada ${Math.round(p.coords.accuracy)} m. Compártela con el botón que aparece en el mapa.`,
        );
      },
      () => {
        setLocating(false);
        setNotification(
          "No pudimos obtener tu ubicación. Revisa permisos o acuerda un punto de reunión.",
        );
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 },
    );
  }
  const allDrivers = grid.data?.drivers ?? drivers;
  const visibleDrivers = allDrivers.filter((d) =>
    `${d.name} ${d.team}`
      .toLocaleLowerCase("es")
      .includes(driverSearch.toLocaleLowerCase("es")),
  );
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
          <span className="connection">
            {online ? <Wifi size={15} /> : <WifiOff size={15} />}
            <span>{online ? "Con conexión" : "Sin conexión"}</span>
          </span>
          <button
            className="icon-button"
            aria-label="Abrir ajustes y accesibilidad"
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
            <strong>Estás sin conexión.</strong> Tu agenda, guía y asientos
            guardados siguen aquí. Los datos deportivos y el clima pueden estar
            desactualizados.
          </Notice>
        )}
        {storageError && <Notice>{storageError}</Notice>}
        {section === "inicio" && (
          <>
            <div className="welcome">
              <span className="eyebrow">
                30 OCT — 01 NOV · AUTÓDROMO HERMANOS RODRÍGUEZ
              </span>
              <h1>
                Tres días.
                <br />
                Una gran <em>F1ESTA.</em>
              </h1>
              <p>Tu lugar, tu gente y toda la emoción de la pista.</p>
            </div>
            <section className="hero">
              <div className="hero-copy">
                <span className="live-label">
                  <span />
                  {next ? activityState(next, now) : "Fin de semana finalizado"}
                </span>
                <span className="eyebrow">
                  {next && new Date(next.start) > now
                    ? "LA PRÓXIMA ACTIVIDAD"
                    : "AHORA EN EL PROGRAMA"}
                </span>
                <h2>{next?.name ?? "Gracias por vivirlo juntos"}</h2>
                <p>
                  {next
                    ? `${days[next.day].label} · ${clock(next.start)} – ${clock(next.end)} · CDMX`
                    : "Consulta los resultados y guarda tus recuerdos."}
                </p>
                {next && new Date(next.start) > now && (
                  <div className="countdown">{countdown(next.start, now)}</div>
                )}
                <button
                  className="button light"
                  onClick={() => {
                    if (next) setDay(next.day);
                    navigate("fin-de-semana");
                  }}
                >
                  Ver mi fin de semana <ArrowRight size={18} />
                </button>
              </div>
              <CircuitArt />
              <div className="hero-stats">
                <div>
                  <strong>
                    4.304 <small>km</small>
                  </strong>
                  <span>EL CIRCUITO</span>
                </div>
                <div>
                  <strong>71</strong>
                  <span>VUELTAS</span>
                </div>
                <div>
                  <strong>3</strong>
                  <span>DÍAS JUNTOS</span>
                </div>
              </div>
            </section>
            <p className="small muted schedule-note">
              Hora de Ciudad de México · Horarios sujetos a cambios. “En
              horario” se calcula con la agenda; no confirma actividad en pista.
            </p>
            <div className="quick-grid">
              <button
                onClick={() => {
                  setDay(today);
                  navigate("fin-de-semana");
                }}
              >
                <TicketIcon />
                <span>
                  Dónde estoy
                  <br />
                  <strong>Mis asientos</strong>
                </span>
                <ChevronRight />
              </button>
              <button onClick={() => navigate("mapa")}>
                <Users />
                <span>
                  Si nos separamos
                  <br />
                  <strong>Encontrarnos</strong>
                </span>
                <ChevronRight />
              </button>
              <button onClick={() => navigate("live")}>
                <Radio />
                <span>
                  Qué está pasando
                  <br />
                  <strong>Ver la pista</strong>
                </span>
                <ChevronRight />
              </button>
            </div>
            <div className="two-columns">
              <div>
                <Heading
                  eyebrow="Tu lugar en la F1ESTA"
                  title={days[today].label}
                />
                <TicketCard
                  day={today}
                  prefs={prefs}
                  edit={() => {
                    setDay(today);
                    setTicketEditor(true);
                  }}
                  compact
                />
              </div>
              <div>
                <Heading
                  eyebrow="Antes de salir"
                  title="El cielo de la ciudad"
                />
                <section className="card weather">
                  <CloudSun className="weather-icon" size={46} />
                  {weather.data ? (
                    <>
                      <div className="temperature">
                        {Math.round(weather.data.temperature)}°
                        <span>Ciudad Deportiva</span>
                      </div>
                      <p>
                        Sensación {Math.round(weather.data.apparent)} °C ·
                        Precipitación {weather.data.rain} mm
                      </p>
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
                      <p className="small muted">
                        Probabilidad de lluvia diaria. Estimaciones, no
                        mediciones dentro de tu grada.
                      </p>
                      <Source
                        meta={weather.data.meta}
                        now={now}
                        offline={!online || !!weather.error}
                      />
                    </>
                  ) : (
                    <>
                      <h3>
                        {weather.loading
                          ? "Consultando el pronóstico…"
                          : "Pronóstico pendiente"}
                      </h3>
                      <p>Se mostrará cuando recibamos datos de Open-Meteo.</p>
                    </>
                  )}
                  {weather.error && <p className="small">{weather.error}</p>}
                </section>
                <section className="observe-card">
                  <span className="eyebrow">
                    <Sun size={15} /> QUÉ OBSERVAR
                  </span>
                  <h3>{next?.f1 ? next.name : "Aprende a mirar la pista"}</h3>
                  <p>{next?.observe ?? lessons[1][1]}</p>
                  <button
                    className="text-button"
                    onClick={() => navigate("guia")}
                  >
                    Entender la F1 <ArrowRight size={16} />
                  </button>
                </section>
              </div>
            </div>
            <Heading
              eyebrow="Información para llegar preparado"
              title="Antes de la bandera verde"
            />
            <div className="news-grid">
              {news.map((n) => (
                <article className="card news" key={n.title}>
                  <span className="pill">{n.kind}</span>
                  <h3>{n.title}</h3>
                  <p>{n.summary}</p>
                  <External href={n.url}>Ver fuente original</External>
                  <span className="small muted block">
                    {n.source} · Verificado {fullTime(n.date)} CDMX
                  </span>
                </article>
              ))}
            </div>
            <p className="small muted">
              Selección editorial verificada; no es un feed de noticias en
              tiempo real.{" "}
              <a href={sources.f1} target="_blank" rel="noreferrer">
                Últimas noticias F1 ↗
              </a>{" "}
              ·{" "}
              <a href={sources.mexico} target="_blank" rel="noreferrer">
                MéxicoGP ↗
              </a>{" "}
              ·{" "}
              <a href={sources.fia} target="_blank" rel="noreferrer">
                FIA ↗
              </a>
            </p>
          </>
        )}
        {section === "fin-de-semana" && (
          <>
            <Heading
              eyebrow="Todo listo para disfrutar"
              title="Mi fin de semana"
            />
            <DayPicker day={day} setDay={setDay} />
            <div className="day-intro">
              <h1>{days[day].focus}</h1>
              <p>{days[day].date} de 2026 · Hora de Ciudad de México</p>
            </div>
            <div className="two-columns weekend">
              <div>
                <Heading
                  eyebrow="De la primera vuelta a la última"
                  title="Tu agenda"
                />
                <div className="agenda">
                  {activities
                    .filter((a) => a.day === day)
                    .map((a) => (
                      <article
                        key={a.id}
                        className={`agenda-item ${a.f1 ? "f1" : ""} ${activityState(a, now) === "En horario" ? "current" : ""}`}
                      >
                        <div className="agenda-time">
                          <strong>{clock(a.start)}</strong>
                          <span>{clock(a.end)}</span>
                        </div>
                        <div>
                          <div className="agenda-label">
                            <span className="pill">
                              {a.f1 ? "FÓRMULA 1" : "EN EL RECINTO"}
                            </span>
                            <span className="small muted">
                              {activityState(a, now)}
                            </span>
                          </div>
                          <h3>{a.name}</h3>
                          <details>
                            <summary>Qué observar</summary>
                            <p>{a.observe}</p>
                          </details>
                        </div>
                      </article>
                    ))}
                </div>
                <div className="source">
                  <External href={sources.schedule}>
                    Programa oficial F1
                  </External>
                  <span>
                    Verificado {fullTime(verifiedAt)} CDMX · Sujeto a cambios
                  </span>
                </div>
              </div>
              <div>
                <TicketCard
                  day={day}
                  prefs={prefs}
                  edit={() => setTicketEditor(true)}
                />
                <section className="card">
                  <h3>
                    <Clock3 size={20} /> Llega con calma
                  </h3>
                  <p>
                    <strong>{days[day].arrival} h</strong> es nuestra sugerencia
                    para llegar a la zona, no un horario garantizado de
                    apertura.
                  </p>
                  <p className="small muted">
                    Reserva margen para controles y caminata. La duración desde
                    la puerta hasta el asiento no está verificada; depende de
                    filas y rutas habilitadas.
                  </p>
                  <External href={sources.access}>
                    Consultar accesos y apertura
                  </External>
                </section>
                <section className="card">
                  <h3>Para disfrutar más el día</h3>
                  <ul className="tips">
                    {days[day].advice.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                    <li>
                      Come en una pausa, compra agua dentro del recinto y busca
                      sombra cuando puedas.
                    </li>
                    <li>
                      Revisa precios y medios de pago antes de comprar comida o
                      recuerdos.
                    </li>
                  </ul>
                </section>
                <section className="card">
                  <label className="label-title" htmlFor="day-notes">
                    Mis notas del {days[day].label.toLowerCase()}
                  </label>
                  <textarea
                    id="day-notes"
                    value={prefs.notes[day]}
                    maxLength={3000}
                    placeholder="Qué queremos ver, qué comprar, un recuerdo…"
                    onChange={(e) =>
                      change("notes", { ...prefs.notes, [day]: e.target.value })
                    }
                  />
                  <span className="small muted">
                    Guardadas solo en este teléfono.
                  </span>
                </section>
              </div>
            </div>
            <Checklist prefs={prefs} update={update} day={day} />
          </>
        )}
        {section === "live" && (
          <TimingPanel now={now} online={online} prefs={prefs} />
        )}
        {section === "pilotos" && (
          <>
            <Heading eyebrow="Los protagonistas" title="Pilotos y equipos" />
            <div className="card intro-card">
              <h3>Una nueva era, la misma pasión.</h3>
              <p>
                2026 incorpora aerodinámica activa y una nueva gestión de
                energía. Conoce a los pilotos, elige a tu favorito y síguelo en
                la pantalla de tiempos.
              </p>
              <External href={sources.rules}>
                Los cambios de 2026, explicados por F1
              </External>
            </div>
            <div className="filter-bar">
              <label>
                Buscar piloto o equipo
                <input
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  placeholder="Checo, Ferrari, McLaren…"
                />
              </label>
              <div className="segmented">
                <button
                  aria-pressed={!teamView}
                  onClick={() => setTeamView(false)}
                >
                  Pilotos
                </button>
                <button
                  aria-pressed={teamView}
                  onClick={() => setTeamView(true)}
                >
                  Equipos
                </button>
              </div>
            </div>
            {teamView && teams.data && (
              <Source
                meta={teams.data.meta}
                now={now}
                offline={!online || !!teams.error}
              />
            )}
            {!teamView && grid.data && (
              <Source
                meta={grid.data.meta}
                now={now}
                offline={!online || !!grid.error}
              />
            )}
            <p className="small muted">
              Los puntos corresponden a la ronda indicada por el proveedor. La
              alineación de temporada puede variar por sustituciones. Podios,
              forma reciente y fortalezas en México: pendientes de una fuente
              verificada.
            </p>
            {!teamView ? (
              <div className="driver-grid">
                {visibleDrivers.map((d) => (
                  <article
                    className="driver-card"
                    key={d.id}
                    style={
                      {
                        "--team": teamColors[d.team] ?? "#516770",
                      } as React.CSSProperties
                    }
                  >
                    <div className="driver-top">
                      <span className="driver-number">{d.number}</span>
                      <button
                        className={`icon-button ${prefs.favorite === d.number ? "favorite" : ""}`}
                        aria-label={`Elegir a ${d.name} como favorito`}
                        aria-pressed={prefs.favorite === d.number}
                        onClick={() =>
                          change(
                            "favorite",
                            prefs.favorite === d.number ? "" : d.number,
                          )
                        }
                      >
                        <Heart
                          size={21}
                          fill={
                            prefs.favorite === d.number
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>
                    <span className="eyebrow">{d.team}</span>
                    <h3>{d.name}</h3>
                    <span className="small muted">{d.nationality}</span>
                    <div className="driver-stats">
                      <div>
                        <span>POSICIÓN</span>
                        <strong>{d.position ?? "—"}</strong>
                      </div>
                      <div>
                        <span>PUNTOS</span>
                        <strong>{d.points ?? "—"}</strong>
                      </div>
                      <div>
                        <span>VICTORIAS</span>
                        <strong>{d.wins ?? "—"}</strong>
                      </div>
                    </div>
                    <p className="small muted">
                      Compañero:{" "}
                      {allDrivers
                        .filter((p) => p.team === d.team && p.id !== d.id)
                        .map((p) => p.name)
                        .join(", ") || "Pendiente"}
                    </p>
                    <External href={d.url}>Ficha y resultados</External>
                  </article>
                ))}
              </div>
            ) : (
              <div className="driver-grid">
                {Array.from(new Set(visibleDrivers.map((d) => d.team))).map(
                  (t) => (
                    <article
                      className="driver-card"
                      key={t}
                      style={
                        {
                          "--team": teamColors[t] ?? "#516770",
                        } as React.CSSProperties
                      }
                    >
                      <span className="eyebrow">ESCUDERÍA 2026</span>
                      <h3>{t}</h3>
                      <div className="driver-stats">
                        <div>
                          <span>POSICIÓN</span>
                          <strong>
                            {teams.data?.teams.find((x) => x.name === t)
                              ?.position ?? "—"}
                          </strong>
                        </div>
                        <div>
                          <span>PUNTOS</span>
                          <strong>
                            {teams.data?.teams.find((x) => x.name === t)
                              ?.points ?? "—"}
                          </strong>
                        </div>
                        <div>
                          <span>VICTORIAS</span>
                          <strong>
                            {teams.data?.teams.find((x) => x.name === t)
                              ?.wins ?? "—"}
                          </strong>
                        </div>
                      </div>
                      {allDrivers
                        .filter((d) => d.team === t)
                        .map((d) => (
                          <p key={d.id}>
                            {d.name} · #{d.number}
                          </p>
                        ))}
                      <p className="small muted">
                        Motor, historia y tendencia: consulta la ficha oficial.
                        La puntuación de constructores procede de su
                        clasificación, no de sumar pilotos.
                      </p>
                      <External href="https://www.formula1.com/en/teams">
                        Conocer al equipo
                      </External>
                    </article>
                  ),
                )}
              </div>
            )}
            {!visibleDrivers.length && (
              <div className="empty">
                No encontramos pilotos con esa búsqueda.
              </div>
            )}
          </>
        )}
        {section === "mapa" && (
          <>
            <Heading
              eyebrow="Menos vueltas fuera de la pista"
              title="Mapa y accesos"
            />
            <DayPicker day={day} setDay={setDay} />
            <Notice>
              Las puertas dependen de la zona y del boleto. No todos los accesos
              permiten entrar a cualquier grada.
            </Notice>
            <div className="two-columns">
              <div>
                <section className="card map-card">
                  <span className="eyebrow">
                    TU RECORRIDO DEL {days[day].label.toUpperCase()}
                  </span>
                  <div className="route-flow">
                    <div>
                      <span>01</span>
                      <strong>Zona {days[day].zone}</strong>
                    </div>
                    <ChevronRight />
                    <div>
                      <span>02</span>
                      <strong>{days[day].gate}</strong>
                    </div>
                    <ChevronRight />
                    <div>
                      <span>03</span>
                      <strong>{days[day].venue}</strong>
                      <small>
                        {currentTicket
                          ? `Sección ${currentTicket.section}`
                          : "Guarda tus asientos"}
                      </small>
                    </div>
                  </div>
                  <p className="small muted">
                    Esquema de acceso, no ruta geográfica. Confirma los
                    señalamientos y el acceso autorizado de tu boleto.
                  </p>
                  <External className="button primary" href={sources.map}>
                    Abrir mapa oficial de servicios
                  </External>
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
                  <div className="map-placeholder">
                    <MapPin size={36} />
                    <h3>Ubícate antes de entrar</h3>
                    <p>
                      El mapa oficial muestra accesos y servicios. Los puntos de
                      baños, alimentos, primeros auxilios y rutas interiores
                      deben consultarse allí.
                    </p>
                    <External href="https://www.openstreetmap.org/?mlat=19.4042&mlon=-99.0907#map=15/19.4042/-99.0907">
                      Ver entorno en OpenStreetMap
                    </External>
                    <span className="small muted">
                      © colaboradores de OpenStreetMap · requiere conexión
                    </span>
                  </div>
                  <div className="button-row">
                    <External className="button primary" href={directions(day)}>
                      Llévame a mi acceso
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
                        Compartir ubicación del grupo
                      </External>
                      <p className="small muted">
                        Ubicación puntual, no seguimiento continuo. Elige el
                        destinatario en WhatsApp.
                      </p>
                    </div>
                  )}
                </section>
                <section className="card">
                  <h3>Cómo llegar sin complicarte</h3>
                  <p>
                    Consulta Metro Línea 9 y las estaciones Velódromo, Ciudad
                    Deportiva y Puebla según tu zona. Revisa el servicio antes
                    de salir.
                  </p>
                  <p>
                    No cuentes con estacionamiento disponible. Los transportes
                    especiales pueden requerir reserva y tienen sus propios
                    puntos de salida.
                  </p>
                  <div className="link-list">
                    <External href={sources.access}>
                      Transporte y accesos MéxicoGP
                    </External>
                    <External href="https://www.metro.cdmx.gob.mx/">
                      Estado de la red Metro
                    </External>
                    <External href="https://www.metrobus.cdmx.gob.mx/">
                      Rutas y avisos de Metrobús
                    </External>
                    <External href="https://guias.ticketmaster.com.mx/ticket2ride/gran-premio-de-la-ciudad-de-mexico/">
                      Servicio Ticket2Ride
                    </External>
                  </div>
                  <p className="small muted">
                    Verificación de enlaces: 26 oct 2026. Consulta cambios
                    durante el fin de semana.
                  </p>
                </section>
              </div>
              <div>
                <TicketCard
                  day={day}
                  prefs={prefs}
                  edit={() => setTicketEditor(true)}
                />
                <section className="card meeting">
                  <h3>
                    <Users size={21} /> Si nos separamos
                  </h3>
                  <label htmlFor="meeting">Nuestro punto de reunión</label>
                  <textarea
                    id="meeting"
                    maxLength={300}
                    placeholder="Acuerden un lugar visible dentro de su zona. Incluyan una hora."
                    value={prefs.meeting}
                    onChange={(e) => change("meeting", e.target.value)}
                  />
                  <p className="small muted">
                    Este texto se guarda solo aquí. Compártelo para que todos
                    tengan la misma versión.
                  </p>
                  <pre className="share-preview">
                    {ticketText(day, currentTicket, prefs.meeting)}
                  </pre>
                  <External
                    className="button primary"
                    href={whatsapp(
                      ticketText(day, currentTicket, prefs.meeting),
                    )}
                  >
                    Compartir por WhatsApp <Share2 size={16} />
                  </External>
                </section>
              </div>
            </div>
          </>
        )}
        {section === "guia" && (
          <>
            <Heading
              eyebrow="Disfrutar también es estar preparado"
              title="Tu guía de bolsillo"
            />
            <Checklist prefs={prefs} update={update} day={day} />
            <div className="two-columns">
              <section className="card">
                <h3>
                  <ShieldCheck size={22} /> Antes de empacar
                </h3>
                <p>
                  Consulta las reglas vigentes de objetos permitidos y
                  prohibidos. Pueden cambiar; esta checklist es una ayuda
                  personal y no autoriza el ingreso de objetos.
                </p>
                <External href={sources.safety}>
                  Lista oficial de seguridad MéxicoGP
                </External>
                <p className="small muted">
                  Revisa tamaños de bolsas, protector solar y condiciones para
                  medicamentos en la fuente oficial.
                </p>
              </section>
              <section className="card">
                <h3>
                  <Download size={22} /> Tu guía, incluso sin señal
                </h3>
                <p>
                  {offlineReady
                    ? "La base offline está preparada. Abre una vez los datos que quieras conservar antes de salir."
                    : "Abre la app con conexión para preparar la base offline."}
                </p>
                <button
                  className="button secondary"
                  onClick={async () => {
                    if (install) {
                      await install.prompt();
                      await install.userChoice;
                      setInstall(null);
                    } else
                      setNotification(
                        "En iPhone: Compartir → Añadir a pantalla de inicio. En Android: menú del navegador → Instalar aplicación.",
                      );
                  }}
                >
                  Instalar en mi teléfono
                </button>
                <p className="small muted">
                  Mapas externos, WhatsApp y actualizaciones necesitan conexión.
                  La agenda y los asientos guardados permanecen en este
                  dispositivo.
                </p>
              </section>
            </div>
            <Heading
              eyebrow="Para entender y disfrutar"
              title="La F1, en palabras simples"
            />
            <div className="lesson-grid">
              {lessons.map(([title, body], i) => (
                <details className="lesson" key={title}>
                  <summary>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {title}
                  </summary>
                  <p>{body}</p>
                </details>
              ))}
            </div>
            <div className="source">
              <span>Guía editorial · revisada 26 oct 2026</span>
              <External href={sources.rules}>
                Terminología oficial 2026
              </External>
              <External href={sources.fia}>Reglas y documentos FIA</External>
            </div>
          </>
        )}
        <footer>
          <span className="brand-mini">MÉXICO 26</span>
          <p>
            Hecho para vivirlo juntos. Guía independiente, sin afiliación con
            F1, FIA o MéxicoGP.
          </p>
          <span>
            {ready && offlineReady ? (
              <>
                <CheckCheck size={14} /> Base offline preparada
              </>
            ) : (
              "Preparando la guía"
            )}{" "}
            · Horarios CDMX
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
      {section !== "fin-de-semana" && today === "sunday" && (
        <button
          className="sunday-access"
          onClick={() => {
            setDay("sunday");
            navigate("fin-de-semana");
          }}
        >
          <TicketIcon size={17} /> Grada 7 · Puerta 13
        </button>
      )}
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
            <option value="paddock">Paddock claro · verde y crema</option>
            <option value="fiesta">México de fiesta · rojo y dorado</option>
            <option value="telemetry">Centro de carrera · azul y blanco</option>
          </select>
        </label>
        <h3>Privacidad en tu teléfono</h3>
        <p>
          Asientos, notas, favorito y checklist se almacenan en este navegador.
          No se sincronizan ni se envían a un servidor. La ubicación solo se
          consulta al tocar “Estoy aquí”.
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
                "¿Borrar tus asientos, notas, checklist y preferencias de este teléfono?",
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
          <input
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
function Checklist({
  prefs,
  update,
  day,
}: {
  prefs: Preferences;
  update: (fn: (p: Preferences) => Preferences) => void;
  day: Day;
}) {
  const done = checklist.filter(
    (_, i) => prefs.checklist[`${day}-${i}`],
  ).length;
  return (
    <section className="card checklist">
      <Heading
        eyebrow={`Preparación del ${days[day].label.toLowerCase()}`}
        title="Que no se nos olvide"
      >
        <span className="pill">
          {done}/{checklist.length}
        </span>
      </Heading>
      <div
        className="progress"
        role="progressbar"
        aria-label="Preparación completada"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={checklist.length}
      >
        <span style={{ width: `${(done / checklist.length) * 100}%` }} />
      </div>
      <div className="checklist-items">
        {checklist.map((item, i) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={!!prefs.checklist[`${day}-${i}`]}
              onChange={(e) =>
                update((p) => ({
                  ...p,
                  checklist: {
                    ...p.checklist,
                    [`${day}-${i}`]: e.target.checked,
                  },
                }))
              }
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import { RefreshCw, Flag, Heart } from "lucide-react";
import type { Preferences, Timing } from "@/lib/types";
import { freshness, lapTime, fullTime, gapTime } from "@/lib/time";
import { useRemote } from "./hooks";
import { Heading, Notice, Source, External } from "./primitives";
export function TimingPanel({
  now,
  online,
  prefs,
}: {
  now: Date;
  online: boolean;
  prefs: Preferences;
}) {
  const [demo, setDemo] = useState(false),
    [filter, setFilter] = useState("all"),
    [team, setTeam] = useState("all");
  const { data, error, loading, reload } = useRemote<Timing>(
    `/api/timing${demo ? "?mode=demo" : ""}`,
    demo ? 300000 : 30000,
  );
  const rows = (data?.rows ?? []).filter(
    (r) =>
      (team === "all" || r.team === team) &&
      (filter === "all" ||
        (filter === "top" && (r.position ?? 99) <= 10) ||
        (filter === "favorite" && String(r.number) === prefs.favorite) ||
        (filter === "battle" &&
          typeof r.interval === "number" &&
          r.interval > 0 &&
          r.interval < 1) ||
        (filter === "changes" && r.change !== null && r.change !== 0)),
  );
  return (
    <>
      <Heading eyebrow="La pista, en tus manos" title="Live timing">
        <button
          className="icon-button"
          onClick={reload}
          disabled={loading}
          aria-label="Actualizar timing"
        >
          <RefreshCw size={20} className={loading ? "spin" : ""} />
        </button>
      </Heading>
      <div className="segmented">
        <button aria-pressed={!demo} onClick={() => setDemo(false)}>
          Datos reales
        </button>
        <button aria-pressed={demo} onClick={() => setDemo(true)}>
          Explorar demo
        </button>
      </div>
      {demo && (
        <Notice>
          <strong>Demo: no es una carrera real.</strong> Todos los tiempos,
          posiciones y mensajes de esta vista son ilustrativos.
        </Notice>
      )}
      {error && <Notice>{error}</Notice>}
      <section className="card">
        <div className="card-heading">
          <h3>
            <Flag size={20} /> {data?.session ?? "México 2026"}
          </h3>
          <span className="pill">
            {data?.sessionState ?? "Actualización pendiente"}
          </span>
        </div>
        <p>
          {data?.message ??
            "Consultando la disponibilidad de la sesión. No se mostrarán posiciones sin una fuente válida."}
        </p>
        {data && (
          <Source meta={data.meta} now={now} offline={!online || !!error} />
        )}
        {data?.meta.updatedAt && (
          <p className="small muted">
            Último dato hace{" "}
            {Math.max(
              0,
              Math.floor(
                (now.getTime() - Date.parse(data.meta.updatedAt)) / 1000,
              ),
            )}{" "}
            segundos.{" "}
            {freshness(data.meta, now, !online || !!error) === "En vivo"
              ? ""
              : "La tabla puede no representar la situación actual."}
          </p>
        )}
      </section>
      <div className="filter-bar">
        <label>
          Mostrar
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos los pilotos</option>
            <option value="favorite">Mi favorito</option>
            <option value="top">Top 10</option>
            <option value="changes">Cambios recientes</option>
            <option value="battle">A menos de 1 segundo</option>
          </select>
        </label>
        <label>
          Escudería
          <select value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">Todas las escuderías</option>
            {Array.from(new Set(data?.rows.map((r) => r.team))).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      {filter === "favorite" && !prefs.favorite && (
        <Notice>Elige tu favorito en Pilotos y equipos.</Notice>
      )}
      {rows.length ? (
        <div
          className="card table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Tabla de tiempos; desplaza horizontalmente para más datos"
        >
          <table>
            <caption className="sr-only">
              {demo
                ? "Simulación de tiempos"
                : "Últimos tiempos recibidos de OpenF1"}
            </caption>
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Piloto</th>
                <th>Al líder</th>
                <th>Al anterior</th>
                <th>Última vuelta</th>
                <th>Mejor vuelta</th>
                <th>Vuelta</th>
                <th>Neumático</th>
                <th>Pits</th>
                <th>Cambio</th>
                <th>Dato CDMX</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.number}>
                  <td className="position">{r.position ?? "—"}</td>
                  <td>
                    <strong>
                      {r.name}{" "}
                      {String(r.number) === prefs.favorite && (
                        <Heart size={13} fill="currentColor" />
                      )}
                    </strong>
                    <span className="small muted block">
                      #{r.number} · {r.team}
                    </span>
                  </td>
                  <td>{r.gap === 0 ? "Líder" : gapTime(r.gap)}</td>
                  <td>{gapTime(r.interval)}</td>
                  <td>{lapTime(r.lastLap)}</td>
                  <td>{lapTime(r.bestLap)}</td>
                  <td>{r.lap ?? "—"}</td>
                  <td>
                    <span className="tyre">
                      {{
                        HARD: "Duro",
                        MEDIUM: "Medio",
                        SOFT: "Blando",
                        INTERMEDIATE: "Intermedio",
                        WET: "Lluvia",
                      }[r.tyre ?? ""] ??
                        r.tyre ??
                        "—"}
                    </span>
                  </td>
                  <td>{r.pits ?? "—"}</td>
                  <td>
                    {r.change === null
                      ? "—"
                      : r.change > 0
                        ? `↑ ${r.change}`
                        : r.change < 0
                          ? `↓ ${-r.change}`
                          : "Sin cambio"}
                  </td>
                  <td className="small">
                    {r.updatedAt
                      ? fullTime(r.updatedAt)
                      : demo
                        ? "Demo"
                        : "Sin dato"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty card">
          <Flag size={32} />
          <h3>
            {loading
              ? "Buscando datos de pista…"
              : "Todavía no hay tiempos para mostrar"}
          </h3>
          <p>
            La guía y tus accesos siguen disponibles. Prueba la demo para
            familiarizarte con esta pantalla.
          </p>
        </div>
      )}
      {rows.length > 0 && (
        <section className="card">
          <Heading eyebrow="Sin tecnicismos" title="Qué acaba de pasar" />
          {rows
            .filter(
              (r) =>
                (r.change ?? 0) > 0 ||
                (typeof r.interval === "number" &&
                  r.interval > 0 &&
                  r.interval < 1),
            )
            .slice(0, 5)
            .map((r) => (
              <p key={r.number}>
                <strong>{r.name}</strong>:{" "}
                {(r.change ?? 0) > 0
                  ? `subió ${r.change} posiciones entre los últimos registros.`
                  : "está a menos de un segundo del auto de adelante."}
              </p>
            ))}
          <p className="muted">
            Una parada acumulada no significa que el piloto esté ahora en pits.
            Los cambios se calculan entre registros del proveedor.
          </p>
        </section>
      )}
      <section className="card">
        <h3>Race Control y banderas</h3>
        {data?.control.length ? (
          data.control.map((c, i) => (
            <article className="control" key={`${c.date}-${i}`}>
              <span className="pill">{c.flag ?? "Mensaje"}</span>
              <p>{c.message}</p>
              <span className="small muted">
                {fullTime(c.date)} ·{" "}
                {demo ? "Demo" : "OpenF1; mensaje original"}
              </span>
            </article>
          ))
        ) : (
          <p className="muted">
            Sin mensajes confirmados. La ausencia de mensajes no significa pista
            libre ni ausencia de sanciones.
          </p>
        )}
        <External href="https://www.fia.com/events/fia-formula-one-world-championship/season-2026">
          Consultar decisiones FIA
        </External>
      </section>
    </>
  );
}

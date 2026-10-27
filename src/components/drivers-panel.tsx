"use client";
import { useState } from "react";
import {
  Heart,
  Search,
  Building2,
  Wrench,
  Trophy,
  CalendarClock,
  UserRound,
} from "lucide-react";
import type { Driver, Grid, Preferences, Teams } from "@/lib/types";
import { drivers as roster, teamColors } from "@/lib/content";
import { driverFacts, teamsInfo } from "@/lib/teams";
import { teamCars } from "@/lib/media";
import { External } from "./primitives";

function splitName(name: string) {
  const parts = name.split(" ");
  return { first: parts.slice(0, -1).join(" "), last: parts.at(-1) ?? name };
}

export function DriversPanel({
  prefs,
  setFavorite,
  grid,
  teams,
}: {
  prefs: Preferences;
  setFavorite: (n: string) => void;
  grid: Grid | null;
  teams: Teams | null;
}) {
  const [q, setQ] = useState("");
  const all: Driver[] = grid?.drivers?.length ? grid.drivers : roster;
  const needle = q.toLocaleLowerCase("es");
  const list = teamsInfo.filter((t) =>
    !needle
      ? true
      : `${t.name} ${t.drivers.map((id) => all.find((d) => d.id === id)?.name ?? id).join(" ")}`
          .toLocaleLowerCase("es")
          .includes(needle),
  );
  return (
    <>
      <div className="page-title">
        <h1>Pilotos</h1>
        <label className="search-pill">
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Buscar piloto o equipo"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar"
          />
        </label>
      </div>
      <div className="team-list">
        {list.map((t) => {
          const color = teamColors[t.name] ?? "#516770",
            car = teamCars[t.name],
            standing = teams?.teams.find((x) => x.name === t.name);
          return (
            <article
              key={t.name}
              className="team-card"
              style={{ "--team": color } as React.CSSProperties}
            >
              <div className="tc-head">
                <h2>{t.name}</h2>
                <span className="tc-badge" aria-hidden="true">
                  {t.short}
                </span>
              </div>
              <ul className="tc-drivers">
                {t.drivers.map((id) => {
                  const d =
                    all.find((x) => x.id === id) ??
                    roster.find((x) => x.id === id);
                  if (!d) return null;
                  const { first, last } = splitName(d.name),
                    fav = prefs.favorite === d.number;
                  return (
                    <li key={id}>
                      <span className="tc-num">{d.number}</span>
                      <span className="tc-name">
                        <span aria-hidden="true">{driverFacts[id]?.flag} </span>
                        {first} <b>{last.toUpperCase()}</b>
                      </span>
                      <button
                        className={`tc-fav ${fav ? "on" : ""}`}
                        aria-label={`Elegir a ${d.name} como favorito`}
                        aria-pressed={fav}
                        onClick={() => setFavorite(fav ? "" : d.number)}
                      >
                        <Heart size={18} fill={fav ? "currentColor" : "none"} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {car && (
                <div className="tc-car">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.src}
                    alt={car.alt}
                    width={car.width}
                    height={car.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <details className="tc-more">
                <summary>
                  Ficha
                  {standing?.position ? (
                    <span className="tc-stand">
                      P{standing.position} · {standing.points} pts
                    </span>
                  ) : null}
                </summary>
                <dl className="tc-facts">
                  <div>
                    <dt>
                      <UserRound size={15} /> Director
                    </dt>
                    <dd>{t.principal}</dd>
                  </div>
                  <div>
                    <dt>
                      <Building2 size={15} /> Base
                    </dt>
                    <dd>{t.base}</dd>
                  </div>
                  <div>
                    <dt>
                      <Wrench size={15} /> Motor
                    </dt>
                    <dd>{t.engine}</dd>
                  </div>
                  <div>
                    <dt>
                      <Trophy size={15} /> Títulos
                    </dt>
                    <dd>{t.titles}</dd>
                  </div>
                  <div>
                    <dt>
                      <CalendarClock size={15} /> Debut
                    </dt>
                    <dd>{t.debut}</dd>
                  </div>
                </dl>
                <ul className="tc-trivia">
                  {t.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                  {t.drivers.map((id) => {
                    const d =
                      all.find((x) => x.id === id) ??
                      roster.find((x) => x.id === id);
                    return d && driverFacts[id] ? (
                      <li key={id}>
                        <b>{splitName(d.name).last}:</b> {driverFacts[id].fact}
                        {d.points != null ? ` · ${d.points} pts` : ""}
                      </li>
                    ) : null;
                  })}
                </ul>
                <External href={t.source}>Ficha oficial</External>
                {car && (
                  <p className="media-credit">
                    Foto: {car.author} · {car.license} · Wikimedia Commons
                  </p>
                )}
              </details>
            </article>
          );
        })}
        {!list.length && <p className="empty">Sin resultados.</p>}
      </div>
    </>
  );
}

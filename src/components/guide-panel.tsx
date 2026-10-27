"use client";
import { useState } from "react";
import {
  Zap,
  Mountain,
  GraduationCap,
  Images,
  Car,
  Hotel,
  Flag,
  Trophy,
  Luggage,
  FileCheck2,
  Download,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";
import type { Preferences } from "@/lib/types";
import { checklist, lessons, sources, teamColors } from "@/lib/content";
import { f1Facts, factSources, mexicoFacts, teamsInfo } from "@/lib/teams";
import { allMedia } from "@/lib/media";
import { driveSources } from "@/lib/travel";
import { External, Fold, MediaCredit } from "./primitives";

const documents = [
  "Pase Turístico impreso (placas de Veracruz)",
  "Documentos de titulación: paquete cerrado y rotulado",
  "Boletos en la app oficial con batería",
  "Identificación oficial",
  "Tarjeta de Movilidad Integrada por persona",
];

export function GuidePanel({
  prefs,
  update,
  install,
  offlineReady,
}: {
  prefs: Preferences;
  update: (fn: (p: Preferences) => Preferences) => void;
  install: () => void;
  offlineReady: boolean;
}) {
  const [tab, setTab] = useState<"datos" | "itinerario">("datos");
  const trip = prefs.trip;
  const all = [...documents, ...checklist];
  const done = all.filter((_, i) => prefs.checklist[`pack-${i}`]).length;
  return (
    <>
      <div className="page-title">
        <h1>Guía</h1>
      </div>
      <div className="segmented wide" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "datos"}
          aria-pressed={tab === "datos"}
          onClick={() => setTab("datos")}
        >
          Datos
        </button>
        <button
          role="tab"
          aria-selected={tab === "itinerario"}
          aria-pressed={tab === "itinerario"}
          onClick={() => setTab("itinerario")}
        >
          Itinerario
        </button>
      </div>

      {tab === "datos" && (
        <div className="stack">
          <Fold
            icon={<Zap />}
            title="F1 2026"
            hint="Lo nuevo de esta temporada"
          >
            <ul className="facts">
              {f1Facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <External href={factSources.regs}>Reglamento 2026</External>
          </Fold>
          <Fold
            icon={<Mountain />}
            title="GP de México"
            hint="Altura, historia y récords"
          >
            <ul className="facts">
              {mexicoFacts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <External href={factSources.mexico}>Sobre el autódromo</External>
          </Fold>
          <h3 className="group-title">
            <Trophy size={16} /> Escuderías
          </h3>
          {teamsInfo.map((t) => (
            <Fold
              key={t.name}
              className="team-fold"
              icon={
                <span
                  className="team-dot"
                  style={{ background: teamColors[t.name] }}
                >
                  {t.short}
                </span>
              }
              title={t.name}
              hint={t.principal.split(" (")[0]}
            >
              <dl className="mini-dl">
                <dt>Base</dt>
                <dd>{t.base}</dd>
                <dt>Motor</dt>
                <dd>{t.engine}</dd>
                <dt>Títulos</dt>
                <dd>{t.titles}</dd>
                <dt>Debut</dt>
                <dd>{t.debut}</dd>
              </dl>
              <ul className="facts">
                {t.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Fold>
          ))}
          <h3 className="group-title">
            <GraduationCap size={16} /> Entender la carrera
          </h3>
          {lessons.map(([title, body]) => (
            <Fold key={title} title={title}>
              <p>{body}</p>
            </Fold>
          ))}
          {allMedia().length > 0 && (
            <Fold
              icon={<Images />}
              title="Créditos de imágenes"
              hint="Wikimedia Commons · CC BY / BY-SA"
            >
              <ul className="credits-list">
                {allMedia().map((m) => (
                  <li key={m.src}>
                    {m.alt}
                    {m.note ? ` (${m.note})` : ""}
                    <br />
                    <MediaCredit media={m} />
                  </li>
                ))}
              </ul>
            </Fold>
          )}
          <p className="fine">
            Datos verificados el 26-oct-2026 ·{" "}
            <a href={factSources.teams} target="_blank" rel="noreferrer">
              F1
            </a>{" "}
            ·{" "}
            <a href={sources.fia} target="_blank" rel="noreferrer">
              FIA
            </a>
          </p>
        </div>
      )}

      {tab === "itinerario" && (
        <div className="stack">
          <ol className="itinerary">
            <li>
              <span className="it-day">JUE 29</span>
              <div>
                <p>
                  <Car size={16} /> Salida temprano desde{" "}
                  {trip.drive.origin || "casa"}
                </p>
                {trip.drive.stop && (
                  <p>
                    <GraduationCap size={16} /> {trip.drive.stop.label} ·{" "}
                    {trip.drive.stop.window}
                  </p>
                )}
                <p>
                  <Hotel size={16} /> Check-in Hotel Beverly desde 15:00
                </p>
                <p>
                  <Utensils size={16} /> Cena en Nápoles
                </p>
              </div>
            </li>
            <li>
              <span className="it-day">VIE 30</span>
              <div>
                <p>
                  <Flag size={16} /> FP1 12:30 · FP2 16:00
                </p>
                <p>
                  <Users size={16} /> Grada 4 · Puerta 9
                </p>
              </div>
            </li>
            <li>
              <span className="it-day">SÁB 31</span>
              <div>
                <p>
                  <Flag size={16} /> FP3 11:30 · Clasificación 15:00
                </p>
                <p>
                  <Users size={16} /> Boxes Oro Sur · Puerta 2
                </p>
              </div>
            </li>
            <li>
              <span className="it-day">DOM 01</span>
              <div>
                <p>
                  <Luggage size={16} /> Check-out antes de las 12:00
                </p>
                <p>
                  <Flag size={16} /> Carrera 14:00 · Grada 7 · Puerta 13
                </p>
              </div>
            </li>
          </ol>
          {trip.drive.stop && (
            <Fold
              icon={<GraduationCap />}
              title="Trámite de titulación"
              hint={trip.drive.stop.window}
            >
              <p>{trip.drive.stop.note}</p>
              <p className="fine">{trip.drive.stop.address}</p>
              <External href="https://escolar.itam.mx/posgrados_controlescolar/titutramite.php">
                Requisitos ITAM posgrados
              </External>
            </Fold>
          )}
          <Fold
            icon={<FileCheck2 />}
            title="Qué llevar"
            hint={`${done}/${all.length} listo`}
            open
          >
            <div
              className="progress"
              role="progressbar"
              aria-label="Preparación completada"
              aria-valuenow={done}
              aria-valuemin={0}
              aria-valuemax={all.length}
            >
              <span style={{ width: `${(done / all.length) * 100}%` }} />
            </div>
            <div className="checklist-items">
              {all.map((item, i) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={!!prefs.checklist[`pack-${i}`]}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        checklist: {
                          ...p.checklist,
                          [`pack-${i}`]: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </Fold>
          <Fold
            icon={<ShieldCheck />}
            title="Objetos permitidos"
            hint="Reglas oficiales"
          >
            <p>
              Revisa tamaños de bolsa, bloqueador y medicamentos antes de
              empacar.
            </p>
            <External href={sources.safety}>Lista oficial MéxicoGP</External>
            <External href={driveSources.pase}>Pase Turístico</External>
          </Fold>
          <Fold
            icon={<Download />}
            title="Instalar la app"
            hint={offlineReady ? "Lista sin conexión" : "Abre con conexión"}
          >
            <p>
              Instálala para abrirla sin señal: agenda, asientos y notas quedan
              en el teléfono.
            </p>
            <button className="button secondary" onClick={install}>
              Instalar en mi teléfono
            </button>
          </Fold>
        </div>
      )}
    </>
  );
}

import { ArrowUpRight, CircleCheck, AlertTriangle, Clock3 } from "lucide-react";
import type { Provenance } from "@/lib/types";
import { fullTime, freshness } from "@/lib/time";
export function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`external ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={15} aria-hidden="true" />
      <span className="sr-only"> (abre otra pestaña)</span>
    </a>
  );
}
export function Source({
  meta,
  now,
  offline = false,
}: {
  meta: Provenance;
  now: Date;
  offline?: boolean;
}) {
  const label = freshness(meta, now, offline);
  return (
    <div className="source">
      <span className={`status ${label === "En vivo" ? "green" : ""}`}>
        {label === "En vivo" ? <CircleCheck size={12} /> : <Clock3 size={12} />}{" "}
        {label}
      </span>
      <External href={meta.url}>{meta.source}</External>
      <span>
        {meta.updatedAt
          ? `${fullTime(meta.updatedAt)} · CDMX`
          : "Sin actualización confirmada"}
      </span>
      <span>
        Confianza:{" "}
        {
          {
            official: "fuente oficial",
            alternative: "fuente alternativa",
            editorial: "orientación editorial",
            demo: "simulación",
          }[meta.confidence]
        }
      </span>
    </div>
  );
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice">
      <AlertTriangle size={18} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
export function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function MediaCredit({ media }: { media: import("@/lib/media").Media }) {
  return (
    <span className="media-credit">
      Foto: {media.author} ·{" "}
      <a href={media.licenseUrl} target="_blank" rel="noopener noreferrer">
        {media.license}
      </a>{" "}
      ·{" "}
      <a href={media.sourceUrl} target="_blank" rel="noopener noreferrer">
        Wikimedia Commons
      </a>
    </span>
  );
}
export function MediaFigure({
  media,
  className = "",
  priority = false,
  credit = true,
}: {
  media: import("@/lib/media").Media;
  className?: string;
  priority?: boolean;
  credit?: boolean;
}) {
  return (
    <figure className={`media-figure ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.src}
        width={media.width}
        height={media.height}
        alt={media.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={media.focus ? { objectPosition: media.focus } : undefined}
      />
      {credit && (
        <figcaption>
          <MediaCredit media={media} />
        </figcaption>
      )}
    </figure>
  );
}

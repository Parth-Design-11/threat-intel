import { useEffect, useRef, useState } from "react";
import { assets } from "../assets";
import { maskIdentifier } from "../exploreData";

const PHASES = [
  { id: "fetch", label: "Fetching the data from 10+ sources", duration: 1800 },
  { id: "classify", label: "Classifying evidences", duration: 1200 },
  { id: "score", label: "Calculating Risk score", duration: 1800 },
] as const;

type LoaderPhase = (typeof PHASES)[number]["id"];

const AXIS_LABELS = [
  "Scam ratio",
  "Scam messages",
  "Unique recipients",
  "Burst score",
  "Fanout ratio",
  "Night activity",
  "Unique scam patterns",
];

const PARTICLE_COUNT = 72;
const ORGANIZE_SLOTS = 3;
const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 132;
const PARTICLE_SIZE = 3;
const PARTICLE_COLOR = "#8b919c";
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const FETCH_MIN = 36;
const FETCH_MAX = 228;
const FETCH_GAP = 16;

function unit(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function heptagon(index: number, radius = RADIUS) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 7;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    angle,
  };
}

function spiralPoint(index: number, total: number, minRadius: number, maxRadius: number) {
  const t = total <= 1 ? 1 : index / (total - 1);
  const dist = minRadius + Math.sqrt(t) * (maxRadius - minRadius);
  const angle = index * GOLDEN_ANGLE;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
  };
}

function separatePoints(points: { x: number; y: number }[], gap: number, maxRadius: number) {
  const next = points.map((point) => ({ ...point }));
  for (let pass = 0; pass < 8; pass += 1) {
    for (let i = 0; i < next.length; i += 1) {
      for (let j = i + 1; j < next.length; j += 1) {
        const dx = next[j].x - next[i].x;
        const dy = next[j].y - next[i].y;
        const dist = Math.hypot(dx, dy) || 0.01;
        if (dist >= gap) continue;
        const push = ((gap - dist) / 2) * (1 / dist);
        next[i].x -= dx * push;
        next[i].y -= dy * push;
        next[j].x += dx * push;
        next[j].y += dy * push;
      }
      const radius = Math.hypot(next[i].x, next[i].y);
      if (radius > maxRadius) {
        next[i].x = (next[i].x / radius) * maxRadius;
        next[i].y = (next[i].y / radius) * maxRadius;
      }
    }
  }
  return next;
}

const FETCH_POINTS = separatePoints(
  Array.from({ length: PARTICLE_COUNT }, (_, index) => spiralPoint(index, PARTICLE_COUNT, FETCH_MIN, FETCH_MAX)),
  FETCH_GAP,
  FETCH_MAX,
);

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const cluster = index % 7;
  const slot = Math.floor(index / 7);
  const tip = heptagon(cluster);
  const keep = slot < ORGANIZE_SLOTS;
  const ringAngle = -Math.PI / 2 + cluster * ((2 * Math.PI) / 7) + (slot - (ORGANIZE_SLOTS - 1) / 2) * 0.55;
  const classifyRadius = 18;
  return {
    id: index,
    cluster,
    keep,
    size: PARTICLE_SIZE,
    color: PARTICLE_COLOR,
    delay: `${unit(index + 29) * 0.45}s`,
    fetch: FETCH_POINTS[index],
    classify: {
      x: tip.x * 0.72 + Math.cos(ringAngle) * classifyRadius,
      y: tip.y * 0.72 + Math.sin(ringAngle) * classifyRadius,
    },
    score: {
      x: tip.x + Math.cos(ringAngle) * 10,
      y: tip.y + Math.sin(ringAngle) * 10,
    },
  };
});

function particleTransform(phase: LoaderPhase, index: number) {
  const particle = PARTICLES[index];
  const point = phase === "fetch" ? particle.fetch : phase === "classify" ? particle.classify : particle.score;
  const scale = phase === "score" ? 0.35 : phase === "classify" && !particle.keep ? 0 : 1;
  return `translate(-50%, -50%) translate(${point.x}px, ${point.y}px) scale(${scale})`;
}

type RiskSearchLoaderProps = {
  query: string;
  onDone: () => void;
  onBack: () => void;
};

export function RiskSearchLoader({ query, onDone, onBack }: RiskSearchLoaderProps) {
  const [phase, setPhase] = useState<LoaderPhase>("fetch");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase("classify"), PHASES[0].duration),
      window.setTimeout(() => setPhase("score"), PHASES[0].duration + PHASES[1].duration),
      window.setTimeout(() => onDoneRef.current(), PHASES[0].duration + PHASES[1].duration + PHASES[2].duration),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <div className="main-inner is-result is-profile-loader">
      <header className="result-header">
        <button type="button" className="result-back" onClick={onBack} aria-label="Back to search">
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title">{maskIdentifier(query)}</h1>
          <p className="result-meta">
            <span className="result-meta-icon">
              <img src={assets.iconUser} alt="" width={16} height={16} />
            </span>
            Sender profile
          </p>
        </div>
      </header>

      <div className={`profile-loader is-${phase}`} role="status" aria-live="polite">
        <div className="profile-loader-stage">
          {PARTICLES.map((particle, index) => (
            <span
              key={particle.id}
              className={`profile-loader-particle${particle.keep ? "" : " is-extra"}`}
              style={{
                width: particle.size,
                height: particle.size,
                transform: particleTransform(phase, index),
                ["--drift-delay" as string]: particle.delay,
                ["--move-delay" as string]: `${particle.cluster * 48 + Math.floor(index / 7) * 10}ms`,
                ["--axis-index" as string]: String(particle.cluster),
              }}
            >
              <i />
            </span>
          ))}

          <div className="profile-loader-glass" aria-hidden="true">
            <svg viewBox="0 0 88 88">
              <circle cx="36" cy="36" r="22" />
              <circle cx="36" cy="36" r="14" className="profile-loader-lens" />
              <path d="M53 53 L72 72" />
            </svg>
          </div>

          <svg className="profile-loader-axes" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
            {AXIS_LABELS.map((label, index) => {
              const tip = heptagon(index);
              const labelPoint = heptagon(index, RADIUS + 36);
              const words = label.split(" ");
              const lines = words.length > 1 && label.length > 12 ? [words.slice(0, -1).join(" "), words.at(-1)!] : [label];
              return (
                <g key={label} className="profile-loader-axis" style={{ ["--axis-index" as string]: String(index) }}>
                  <line x1={CX} y1={CY} x2={CX + tip.x} y2={CY + tip.y} />
                  <circle cx={CX + tip.x} cy={CY + tip.y} r="3.5" />
                  <text x={CX + labelPoint.x} y={CY + labelPoint.y} textAnchor="middle">
                    {lines.map((line, lineIndex) => (
                      <tspan key={line} x={CX + labelPoint.x} dy={lineIndex === 0 ? 0 : 12}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
            <circle className="profile-loader-hub" cx={CX} cy={CY} r="8" />
          </svg>
        </div>

        <div className="profile-loader-copy">
          {PHASES.map((item, index) => {
            const current = PHASES.findIndex((entry) => entry.id === phase);
            const state = index === current ? "is-in" : index < current ? "is-out" : "is-wait";
            return (
              <p key={item.id} className={`profile-loader-status ${state}`} aria-hidden={state !== "is-in"}>
                {item.label.split(" ").map((word, wordIndex) => (
                  <span key={`${item.id}-${word}`} style={{ animationDelay: `${32 + wordIndex * 36}ms` }}>
                    {word}
                  </span>
                ))}
                {state === "is-in" ? <span className="profile-loader-ellipsis" aria-hidden="true" /> : null}
              </p>
            );
          })}
          <ol className="profile-loader-steps" aria-hidden="true">
            {PHASES.map((item, index) => {
              const current = PHASES.findIndex((entry) => entry.id === phase);
              return (
                <li
                  key={item.id}
                  className={index === current ? "is-active" : index < current ? "is-done" : ""}
                  style={{ ["--step-duration" as string]: `${item.duration}ms` }}
                />
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

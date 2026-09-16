import { useEffect, useId, useRef, useState } from "react";
import type { ProfileTone } from "../exploreData";

type SpiderAxis = {
  label: string;
  strength: number;
  value: string;
  threshold: string;
  thresholdStrength: number;
};

type RiskSpiderChartProps = {
  score: string;
  label: string;
  tone: ProfileTone;
  axes: SpiderAxis[];
  interactive?: boolean;
  showLegend?: boolean;
  onStageChange?: (stage: BuildStage) => void;
};

type BuildStage = "grid" | "web" | "score";

const SIZE = 480;
const CX = SIZE / 2;
const CY = SIZE / 2;
const INNER = 78;
const RADIUS = 146;
const CORE_RADIUS = 74;
const LABEL_PAD = 32;
const RINGS = [0.25, 0.5, 0.75, 1];
const GRID_MS = 920;
const WEB_MS = 720;
const HOVER_DELAY_MS = 250;
const LINK_DRAW_MS = 280;

function polarAt(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
    angle,
  };
}

function polar(index: number, total: number, strength: number) {
  return polarAt(index, total, INNER + (RADIUS - INNER) * strength);
}

function ringPoints(total: number, strength: number) {
  return Array.from({ length: total }, (_, index) => polar(index, total, strength))
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
}

function labelAnchor(angle: number) {
  const x = Math.cos(angle);
  if (x > 0.4) return "start";
  if (x < -0.4) return "end";
  return "middle";
}

function labelLines(label: string) {
  const words = label.split(" ");
  if (words.length < 2 || label.length <= 12) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function clampStrength(value: number) {
  return Math.min(1, Math.max(0, value));
}

function parseMetricNumber(value: string) {
  if (!value || value === "—") return null;
  const parsed = Number(value.replace(/[,%]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDelta(result: string, threshold: string) {
  const resultValue = parseMetricNumber(result);
  const thresholdValue = parseMetricNumber(threshold);
  if (resultValue === null || thresholdValue === null) return null;

  const delta = resultValue - thresholdValue;
  const abs = Math.abs(delta);
  const formatted =
    Number.isInteger(resultValue) && Number.isInteger(thresholdValue)
      ? abs.toLocaleString()
      : abs >= 1
        ? abs.toFixed(1).replace(/\.0$/, "")
        : abs.toFixed(2);
  return { text: `${delta >= 0 ? "+" : "−"}${formatted}`, above: delta >= 0, abs: formatted };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useCountUp(active: boolean, target: string) {
  const [display, setDisplay] = useState(active ? target : "0");

  useEffect(() => {
    if (!active) {
      setDisplay("0");
      return;
    }

    const parsed = Number.parseInt(target, 10);
    if (Number.isNaN(parsed) || prefersReducedMotion()) {
      setDisplay(target);
      return;
    }

    const duration = 520;
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(String(Math.round(parsed * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return display;
}

export function RiskSpiderChart({
  score,
  label,
  tone,
  axes,
  interactive = true,
  showLegend = true,
  onStageChange,
}: RiskSpiderChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const fillId = `spider-fill-${gradientId}`;
  const strokeId = `spider-stroke-${gradientId}`;
  const total = axes.length;
  const [stage, setStage] = useState<BuildStage>(() => (prefersReducedMotion() ? "score" : "grid"));
  const [linked, setLinked] = useState<number | null>(null);
  const [tip, setTip] = useState<number | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const tipTimer = useRef<number | null>(null);
  const shownScore = useCountUp(stage === "score", score);

  function clearHoverTimer() {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (tipTimer.current !== null) {
      window.clearTimeout(tipTimer.current);
      tipTimer.current = null;
    }
  }

  function scheduleHover(index: number) {
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => {
      setLinked(index);
      setTip(null);
      tipTimer.current = window.setTimeout(() => {
        setTip(index);
        tipTimer.current = null;
      }, LINK_DRAW_MS);
      hoverTimer.current = null;
    }, HOVER_DELAY_MS);
  }

  function endHover() {
    clearHoverTimer();
    setLinked(null);
    setTip(null);
  }

  const buildKey = `${score}|${axes.map((axis) => `${axis.label}:${axis.strength}:${axis.value}:${axis.threshold}`).join("|")}`;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStage("score");
      onStageChange?.("score");
      return;
    }

    setStage("grid");
    onStageChange?.("grid");
    clearHoverTimer();
    setLinked(null);
    setTip(null);
    const webTimer = window.setTimeout(() => {
      setStage("web");
      onStageChange?.("web");
    }, GRID_MS);
    const scoreTimer = window.setTimeout(() => {
      setStage("score");
      onStageChange?.("score");
    }, GRID_MS + WEB_MS);
    return () => {
      window.clearTimeout(webTimer);
      window.clearTimeout(scoreTimer);
      clearHoverTimer();
    };
  }, [buildKey]);

  const shape = axes
    .map((axis, index) => {
      const point = polar(index, total, clampStrength(axis.strength));
      return `${point.x},${point.y}`;
    })
    .join(" ");
  const thresholdShape = axes
    .map((axis, index) => {
      const point = polar(index, total, clampStrength(axis.thresholdStrength));
      return `${point.x},${point.y}`;
    })
    .join(" ");

  const hovered = linked !== null ? axes[linked] : null;
  const hoverPoint = linked !== null ? polar(linked, total, clampStrength(axes[linked].strength)) : null;
  const hoverThresholdPoint = linked !== null ? polar(linked, total, clampStrength(axes[linked].thresholdStrength)) : null;
  const hoverDelta = hovered ? formatDelta(hovered.value, hovered.threshold) : null;
  const deltaLength =
    hoverPoint && hoverThresholdPoint
      ? Math.hypot(hoverPoint.x - hoverThresholdPoint.x, hoverPoint.y - hoverThresholdPoint.y)
      : 0;
  const tipSide =
    hoverPoint && Math.sin(hoverPoint.angle) < -0.55
      ? "is-below"
      : hoverPoint && Math.cos(hoverPoint.angle) > 0.4
        ? "is-right"
        : hoverPoint && Math.cos(hoverPoint.angle) < -0.4
          ? "is-left"
          : "is-above";

  return (
    <div className="profile-spider-block">
    <div
      className={`profile-spider${tone === "risk" ? " is-risk" : ""}${stage !== "grid" ? " is-web" : ""}${stage === "score" ? " is-score" : ""}`}
    >
      <svg className="profile-spider-svg" viewBox={`0 0 ${SIZE} ${SIZE}`} overflow="visible" role="img" aria-label={`Risk score ${score}, ${label}`}>
        <defs>
          <linearGradient id={fillId} x1="18%" y1="8%" x2="86%" y2="92%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#dc2626" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id={strokeId} x1="18%" y1="8%" x2="86%" y2="92%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        <g className="profile-spider-skeleton">
          {RINGS.map((ring, ringIndex) => (
            <polygon
              key={ring}
              className="profile-spider-ring"
              points={ringPoints(total, ring)}
              style={{ animationDelay: `${80 + ringIndex * 90}ms` }}
            />
          ))}
          {axes.map((axis, index) => {
            const tip = polarAt(index, total, RADIUS);
            const labelPoint = polarAt(index, total, RADIUS + LABEL_PAD);
            const lines = labelLines(axis.label);
            const active = linked === index;
            return (
              <g key={axis.label} className={`profile-spider-spoke${active ? " is-active" : ""}`}>
                <line
                  className="profile-spider-axis"
                  x1={CX}
                  y1={CY}
                  x2={tip.x}
                  y2={tip.y}
                  style={{ animationDelay: `${160 + index * 70}ms` }}
                />
                <text
                  className="profile-spider-label"
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor={labelAnchor(labelPoint.angle)}
                  style={{ animationDelay: `${420 + index * 70}ms` }}
                >
                  {lines.map((line, lineIndex) => (
                    <tspan
                      key={line}
                      x={labelPoint.x}
                      dy={lineIndex === 0 ? `${-((lines.length - 1) * 6)}` : "13"}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
          <circle className="profile-spider-core-disc" cx={CX} cy={CY} r={CORE_RADIUS} />
        </g>

        <g className="profile-spider-plot" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <polygon
            className="profile-spider-shape"
            points={shape}
            fill={`url(#${fillId})`}
            stroke={`url(#${strokeId})`}
          />
          {axes.map((axis, index) => {
            const point = polar(index, total, clampStrength(axis.strength));
            const thresholdPoint = polar(index, total, clampStrength(axis.thresholdStrength));
            const active = linked === index;
            return (
              <g
                key={`${axis.label}-dot`}
                className={`profile-spider-point${active ? " is-active" : ""}`}
                onMouseEnter={interactive ? () => scheduleHover(index) : undefined}
                onMouseLeave={interactive ? endHover : undefined}
              >
                <circle className="profile-spider-hit" cx={point.x} cy={point.y} r="22" />
                <circle className="profile-spider-hit" cx={thresholdPoint.x} cy={thresholdPoint.y} r="16" />
                <circle
                  className="profile-spider-dot"
                  cx={point.x}
                  cy={point.y}
                  r={active ? 7 : 5.5}
                  tabIndex={interactive ? 0 : undefined}
                  role="img"
                  aria-label={`${axis.label}, result ${axis.value}, threshold ${axis.threshold}`}
                  style={{ animationDelay: `${80 + index * 50}ms` }}
                  onFocus={interactive ? () => scheduleHover(index) : undefined}
                  onBlur={interactive ? endHover : undefined}
                />
              </g>
            );
          })}
        </g>

        <g className="profile-spider-threshold-layer">
          <polygon className="profile-spider-threshold" points={thresholdShape} />
          {axes.map((axis, index) => {
            const point = polar(index, total, clampStrength(axis.thresholdStrength));
            return (
              <circle
                key={`${axis.label}-threshold`}
                className={`profile-spider-threshold-dot${linked === index ? " is-active" : ""}`}
                cx={point.x}
                cy={point.y}
                r={linked === index ? 6 : 5}
              />
            );
          })}
          {linked !== null && hoverPoint && hoverThresholdPoint ? (
            <line
              key={`delta-${linked}`}
              className="profile-spider-delta"
              x1={hoverThresholdPoint.x}
              y1={hoverThresholdPoint.y}
              x2={hoverPoint.x}
              y2={hoverPoint.y}
              style={{ strokeDasharray: deltaLength, strokeDashoffset: deltaLength }}
            />
          ) : null}
        </g>
      </svg>

      <div className="profile-spider-core">
        <p className={`profile-risk-value${tone === "risk" ? " is-risk" : ""}`}>{shownScore}</p>
        <span className={`profile-chip${tone === "risk" ? " is-risk" : tone === "moderate" ? " is-moderate" : ""}`}>
          {label}
        </span>
      </div>

      {interactive && tip !== null && hovered && hoverPoint ? (
        <div
          className={`profile-spider-tip ${tipSide}`}
          style={{ left: `${(hoverPoint.x / SIZE) * 100}%`, top: `${(hoverPoint.y / SIZE) * 100}%` }}
          role="tooltip"
        >
          <p className="profile-spider-tip-label">{hovered.label}</p>
          <div className="profile-spider-tip-compare">
            <div>
              <p>Result</p>
              <strong>{hovered.value}</strong>
            </div>
            <div>
              <p>Threshold</p>
              <strong>{hovered.threshold}</strong>
            </div>
            <div>
              <p>Score</p>
              <strong>{Math.round(hovered.strength * 100)}</strong>
            </div>
          </div>
          {hoverDelta ? (
            <p className={`profile-spider-tip-delta${hoverDelta.above ? " is-above" : " is-below"}`}>
              {hoverDelta.abs} {hoverDelta.above ? "above" : "below"} threshold
            </p>
          ) : null}
        </div>
      ) : null}

    </div>
      {showLegend ? (
        <div className="profile-spider-legend">
          <span>
            <i className="is-result" />
            Result
          </span>
          <span>
            <i className="is-threshold" />
            Threshold
          </span>
        </div>
      ) : null}
    </div>
  );
}

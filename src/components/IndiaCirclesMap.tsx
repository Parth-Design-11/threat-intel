import { useEffect, useMemo, useState } from "react";
import { SCAMMER_CIRCLES, TOP_CIRCLES, type CircleTarget } from "../insightsData";

type IndiaCirclesMapProps = {
  period: string;
};

type MapView = "scammers" | "targets";

type IndiaState = {
  id: string;
  name: string;
  d: string;
  labelX?: number;
  labelY?: number;
};

const MAP_TABS = [
  { id: "scammers", label: "Scammer location" },
  { id: "targets", label: "Target areas" },
] as const;

const CIRCLES_BY_VIEW: Record<MapView, CircleTarget[]> = {
  scammers: SCAMMER_CIRCLES,
  targets: TOP_CIRCLES,
};

const HEAT_STOPS = [
  { t: 0, r: 254, g: 215, b: 170 },
  { t: 0.45, r: 249, g: 115, b: 22 },
  { t: 1, r: 185, g: 28, b: 28 },
] as const;

function heatmapColor(shareNum: number, maxShare: number) {
  const t = Math.min(1, Math.max(0, shareNum / maxShare));
  const nextIndex = HEAT_STOPS.findIndex((stop) => t <= stop.t);
  const end = HEAT_STOPS[nextIndex === -1 ? HEAT_STOPS.length - 1 : Math.max(nextIndex, 1)];
  const start = HEAT_STOPS[Math.max(0, HEAT_STOPS.indexOf(end) - 1)];
  const span = end.t - start.t || 1;
  const local = (t - start.t) / span;
  const r = Math.round(start.r + (end.r - start.r) * local);
  const g = Math.round(start.g + (end.g - start.g) * local);
  const b = Math.round(start.b + (end.b - start.b) * local);
  return `rgb(${r} ${g} ${b})`;
}

export function IndiaCirclesMap({ period }: IndiaCirclesMapProps) {
  const [view, setView] = useState<MapView>("scammers");
  const circles = CIRCLES_BY_VIEW[view];
  const [active, setActive] = useState<string>(circles[0].circle);
  const [states, setStates] = useState<IndiaState[] | null>(null);

  const byState = useMemo(() => new Map(circles.map((row) => [row.stateId, row])), [circles]);
  const byName = useMemo(() => new Map(circles.map((row) => [row.circle, row])), [circles]);
  const maxShare = Math.max(...circles.map((row) => row.shareNum));

  useEffect(() => {
    void import("../assets/india-states.json").then((module) => {
      setStates(module.default as IndiaState[]);
    });
  }, []);

  useEffect(() => {
    setActive(circles[0].circle);
  }, [circles]);

  const activeCircle = byName.get(active) ?? circles[0];
  const activeState = useMemo(
    () => states?.find((state) => state.id === activeCircle.stateId),
    [activeCircle.stateId, states],
  );

  const isTargets = view === "targets";
  const title = isTargets ? "Target areas" : "Scammer location";
  const shareLabel = isTargets ? "Share of attacks" : "Share of originations";
  const shareRow = isTargets ? "Attack share" : "Origination share";

  return (
    <section className="chart-card insights-map-card" aria-label={`${title} map for ${period}`}>
      <div className="insights-map-head">
        <div className="tabs insights-map-tabs" role="tablist" aria-label="Map view">
          {MAP_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={view === item.id}
              className={`tab${view === item.id ? " is-active" : ""}`}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="insights-map-period">{period}</p>
      </div>

      <div className="insights-map-layout">
        <div className="insights-map-canvas">
          {!states ? (
            <div className="insights-map-loading">Loading map…</div>
          ) : (
            <svg
              viewBox="0 0 1000 1000"
              className="insights-india-map"
              role="img"
              aria-label={`India map showing ${title.toLowerCase()} for smishing attacks`}
            >
              {states.map((state) => {
                const target = byState.get(state.id);
                const isActive = target?.circle === active;
                const isTarget = Boolean(target);

                return (
                  <path
                    key={state.id}
                    id={state.id}
                    d={state.d}
                    className={`insights-map-state${isTarget ? " is-target" : ""}${isActive ? " is-active" : ""}`}
                    fill={isTarget ? heatmapColor(target!.shareNum, maxShare) : "#fff7ed"}
                    fillOpacity={1}
                    stroke="#ffffff"
                    strokeWidth={isActive ? 1.8 : 0.8}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    onMouseEnter={() => {
                      if (target) setActive(target.circle);
                    }}
                    onFocus={() => {
                      if (target) setActive(target.circle);
                    }}
                    tabIndex={isTarget ? 0 : -1}
                    role={isTarget ? "button" : undefined}
                    aria-label={isTarget ? `${state.name}, ${target!.share} share` : state.name}
                  />
                );
              })}

              {activeState?.labelX && activeState.labelY ? (
                <g className="insights-map-callout" pointerEvents="none">
                  <rect
                    x={activeState.labelX - 34}
                    y={activeState.labelY - 28}
                    width="68"
                    height="22"
                    rx="4"
                  />
                  <text x={activeState.labelX} y={activeState.labelY - 13} textAnchor="middle">
                    {activeCircle.share}
                  </text>
                </g>
              ) : null}
            </svg>
          )}

          <div className="insights-map-scale" aria-hidden="true">
            <span>Low</span>
            <div className="insights-map-scale-bar" />
            <span>High</span>
          </div>
        </div>

        <aside className="insights-map-sidebar">
          <p className="insights-map-sidebar-label">{shareLabel}</p>
          <ol className="insights-map-rank">
            {circles.map((row, index) => (
              <li key={row.circle}>
                <button
                  type="button"
                  className={`insights-map-rank-item${active === row.circle ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(row.circle)}
                  onFocus={() => setActive(row.circle)}
                  onClick={() => setActive(row.circle)}
                >
                  <span className="insights-map-rank-index">{index + 1}</span>
                  <span className="insights-map-rank-name">{row.circle}</span>
                  <span className="insights-map-rank-share">{row.share}</span>
                  <span className="insights-map-rank-mom">{row.mom}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="insights-map-detail">
            <p className="insights-map-detail-name">{activeCircle.circle}</p>
            <div className="insights-map-detail-row">
              <span>{shareRow}</span>
              <strong>{activeCircle.share}</strong>
            </div>
            <div className="insights-map-detail-row">
              <span>MoM change</span>
              <strong className={activeCircle.mom === "—" ? "is-muted" : ""}>{activeCircle.mom}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

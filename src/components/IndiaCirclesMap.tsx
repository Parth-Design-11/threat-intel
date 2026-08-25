import { useEffect, useMemo, useState } from "react";
import { TOP_CIRCLES } from "../insightsData";

type IndiaCirclesMapProps = {
  period: string;
};

type IndiaState = {
  id: string;
  name: string;
  d: string;
  labelX?: number;
  labelY?: number;
};

const MAX_SHARE = Math.max(...TOP_CIRCLES.map((row) => row.shareNum));

const TARGET_BY_STATE = new Map(TOP_CIRCLES.map((row) => [row.stateId, row]));
const TARGET_BY_NAME = new Map(TOP_CIRCLES.map((row) => [row.circle, row]));

function fillOpacity(shareNum: number) {
  return 0.35 + (shareNum / MAX_SHARE) * 0.55;
}

export function IndiaCirclesMap({ period }: IndiaCirclesMapProps) {
  const [active, setActive] = useState<string>(TOP_CIRCLES[0].circle);
  const [states, setStates] = useState<IndiaState[] | null>(null);

  useEffect(() => {
    void import("../assets/india-states.json").then((module) => {
      setStates(module.default as IndiaState[]);
    });
  }, []);

  const activeCircle = TARGET_BY_NAME.get(active) ?? TOP_CIRCLES[0];
  const activeState = useMemo(
    () => states?.find((state) => state.id === activeCircle.stateId),
    [activeCircle.stateId, states],
  );

  return (
    <section className="chart-card insights-map-card" aria-label={`Top targeted circles map for ${period}`}>
      <p className="insights-card-title">Top targeted circles · {period}</p>

      <div className="insights-map-layout">
        <div className="insights-map-canvas">
          {!states ? (
            <div className="insights-map-loading">Loading map…</div>
          ) : (
            <svg
              viewBox="0 0 1000 1000"
              className="insights-india-map"
              role="img"
              aria-label="India map showing telecom circles targeted by smishing attacks"
            >
            {states.map((state) => {
              const target = TARGET_BY_STATE.get(state.id);
              const isActive = target?.circle === active;
              const isTarget = Boolean(target);

              return (
                <path
                  key={state.id}
                  id={state.id}
                  d={state.d}
                  className={`insights-map-state${isTarget ? " is-target" : ""}${isActive ? " is-active" : ""}`}
                  fill={isTarget ? "#256dec" : "#eef1f4"}
                  fillOpacity={isTarget ? fillOpacity(target!.shareNum) : 1}
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
          <p className="insights-map-sidebar-label">Share of attacks</p>
          <ol className="insights-map-rank">
            {TOP_CIRCLES.map((row, index) => (
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
              <span>Attack share</span>
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

import { useState } from "react";
import {
  CHANNEL_SPLIT,
  CTA_CHIPS,
  CTA_SPARKLINE,
  INSIGHTS_PERIODS,
  INSIGHTS_SUMMARY,
  LANDSCAPE_CARDS,
  TOP_PATTERNS,
  TREND_MONTHS,
  USE_CASES,
  type InsightsPeriod,
} from "../insightsData";
import { IndiaCirclesMap } from "./IndiaCirclesMap";
import { InsightsAiWidget } from "./InsightsAiWidget";

type InsightsPageProps = {
  onAnalyze?: (excerpt: string) => void;
};

const LANDSCAPE_WIDGET_IDS = ["landscape-users", "landscape-modus", "landscape-scammer"] as const;

export function InsightsPage({ onAnalyze }: InsightsPageProps) {
  const [period, setPeriod] = useState<InsightsPeriod>("July 2026");

  return (
    <div className="main-inner is-insights">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="insights-subtitle">
            {INSIGHTS_SUMMARY.tenant} · {INSIGHTS_SUMMARY.subtitle}
          </p>
        </div>
        <div className="insights-actions">
          <select
            className="insights-select"
            value={period}
            onChange={(event) => setPeriod(event.target.value as InsightsPeriod)}
            aria-label="Reporting period"
          >
            {INSIGHTS_PERIODS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="button" className="btn-cancel">
            Export PDF
          </button>
          <button type="button" className="btn-access">
            Share brief
          </button>
        </div>
      </div>

      <section className="metrics insights-metrics" aria-label="Executive summary">
        <InsightsAiWidget widgetId="users-protected" period={period} className="metric-card">
          <p className="metric-label">Users Protected</p>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.usersProtected}</p>
            <span className="metric-trend is-up">{INSIGHTS_SUMMARY.usersProtectedDelta}</span>
          </div>
        </InsightsAiWidget>
        <InsightsAiWidget widgetId="smishing-attacks" period={period} className="metric-card">
          <p className="metric-label">Smishing Attacks</p>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.smishingAttacks}</p>
            <span className="metric-trend is-warn">{INSIGHTS_SUMMARY.channelDelta}</span>
          </div>
        </InsightsAiWidget>
        <InsightsAiWidget widgetId="impersonations-blocked" period={period} className="metric-card">
          <p className="metric-label">Impersonations Blocked</p>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.impersonationsBlocked}</p>
            <span className="metric-trend is-down">{INSIGHTS_SUMMARY.impersonationsDelta}</span>
          </div>
        </InsightsAiWidget>
        <InsightsAiWidget widgetId="customer-complaints" period={period} className="metric-card">
          <p className="metric-label">Customer Complaints</p>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.customerComplaints}</p>
            <span className="metric-trend is-down">{INSIGHTS_SUMMARY.complaintsDelta}</span>
          </div>
        </InsightsAiWidget>
      </section>

      <div className="insights-banner">{INSIGHTS_SUMMARY.takeaway}</div>

      <section className="insights-grid-2">
        <InsightsAiWidget widgetId="protection-trend" period={period} className="chart-card insights-chart-card">
          <div className="chart-header">
            <p className="chart-title">Protection trend · Feb–Jul 2026</p>
          </div>
          <div className="insights-bar-chart" aria-hidden="true">
            {TREND_MONTHS.map((month) => (
              <div key={month.label} className="insights-bar-group">
                <div className="insights-bars">
                  <div className="insights-bar is-a2p" style={{ height: `${month.a2p}%` }} />
                  <div className="insights-bar is-p2p" style={{ height: `${month.p2p}%` }} />
                </div>
                <span className="insights-bar-label">{month.label}</span>
              </div>
            ))}
          </div>
          <div className="insights-legend">
            <span>
              <i className="insights-swatch is-a2p" /> A2P messages
            </span>
            <span>
              <i className="insights-swatch is-p2p" /> P2P messages
            </span>
          </div>
          <p className="insights-note">
            <strong>15 July spike:</strong> ~1.7× daily average users targeted and ~2× scam traffic vs July
            daily average.
          </p>
        </InsightsAiWidget>

        <InsightsAiWidget widgetId="channel-split" period={period} className="metric-card insights-side-card">
          <p className="insights-card-title">Channel split · {period}</p>
          <div className="insights-stat-list">
            <div className="insights-stat-row">
              <span>Total scam messages</span>
              <strong>{CHANNEL_SPLIT.total}</strong>
            </div>
            <div className="insights-split-bar" aria-hidden="true">
              <span className="is-a2p" />
              <span className="is-p2p" />
            </div>
            <div className="insights-stat-row">
              <span>A2P</span>
              <strong>{CHANNEL_SPLIT.a2p}</strong>
            </div>
            <div className="insights-stat-row">
              <span>P2P</span>
              <strong>{CHANNEL_SPLIT.p2p}</strong>
            </div>
            <hr className="insights-divider" />
            <div className="insights-stat-row">
              <span>Users protected</span>
              <strong>{CHANNEL_SPLIT.usersProtected}</strong>
            </div>
            <div className="insights-stat-row">
              <span>Avg attacks per user</span>
              <strong>{CHANNEL_SPLIT.attacksPerUser}</strong>
            </div>
            <div className="insights-stat-row">
              <span>Users per scammer</span>
              <strong>{CHANNEL_SPLIT.usersPerScammer}</strong>
            </div>
          </div>
        </InsightsAiWidget>
      </section>

      <section className="insights-grid-3">
        {LANDSCAPE_CARDS.map((card, index) => (
          <InsightsAiWidget
            key={card.title}
            widgetId={LANDSCAPE_WIDGET_IDS[index]}
            period={period}
            className="metric-card insights-side-card"
          >
            <p className="insights-card-title">{card.title}</p>
            <div className="insights-stat-list">
              {card.rows.map(([label, value]) => (
                <div key={label} className="insights-stat-row">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </InsightsAiWidget>
        ))}
      </section>

      <section className="insights-grid-2">
        <InsightsAiWidget widgetId="targeted-circles" period={period}>
          <IndiaCirclesMap period={period} />
        </InsightsAiWidget>

        <InsightsAiWidget widgetId="use-case-mix" period={period} className="metric-card insights-side-card">
          <p className="insights-card-title">Use case mix · A2P vs P2P</p>
          <div className="insights-use-cases">
            {USE_CASES.map((item) => (
              <div key={item.label} className="insights-use-case">
                <div className="insights-use-case-head">
                  <span>{item.label}</span>
                  <strong>{item.detail}</strong>
                </div>
                <div className="insights-use-case-track">
                  <div
                    className={`insights-use-case-fill${item.muted ? " is-muted" : ""}`}
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </InsightsAiWidget>
      </section>

      <InsightsAiWidget widgetId="top-patterns" period={period} className="table-card insights-table-card">
        <p className="insights-card-title is-table">Top scam patterns · {period}</p>
        <div className="table-wrap">
          <div className="thead insights-patterns-head">
            <div className="th">Pattern excerpt</div>
            <div className="th">Volume</div>
            <div className="th">% scams</div>
            <div className="th">Users</div>
            <div className="th is-actions" />
          </div>
          {TOP_PATTERNS.map((row) => (
            <div key={row.id} className="trow insights-patterns-row">
              <div className="td">
                <span className="insights-pattern">{row.excerpt}</span>
              </div>
              <div className="td">{row.volume}</div>
              <div className="td">{row.share}</div>
              <div className="td">{row.users}</div>
              <div className="td is-actions">
                <button type="button" className="insights-link-btn" onClick={() => onAnalyze?.(row.excerpt)}>
                  Analyze →
                </button>
              </div>
            </div>
          ))}
        </div>
      </InsightsAiWidget>

      <InsightsAiWidget widgetId="cta-intelligence" period={period} className="chart-card insights-chart-card">
        <div className="chart-header">
          <p className="chart-title">CTA intelligence · {period}</p>
        </div>
        <div className="insights-chips">
          {CTA_CHIPS.map((chip) => (
            <span key={chip.text} className="insights-chip">
              <strong>{chip.label}</strong> {chip.text}
            </span>
          ))}
        </div>
        <p className="insights-spark-label">Distinct CTA volume trend (May → Jul)</p>
        <div className="insights-sparkline" aria-hidden="true">
          {CTA_SPARKLINE.map((height, index) => (
            <span key={index} className="insights-spark" style={{ height: `${height}%` }} />
          ))}
        </div>
        <p className="insights-note">
          CTAs rotate quickly — most URL-based CTAs appear for less than 24 hours before being replaced. This
          supports proactive blocking rather than complaint-driven response.
        </p>
      </InsightsAiWidget>
    </div>
  );
}

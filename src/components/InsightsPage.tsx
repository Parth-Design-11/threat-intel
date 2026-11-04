import { useEffect, useState } from "react";
import {
  CHANNEL_SPLIT,
  CTA_CHIPS,
  CTA_SPARKLINE,
  INSIGHTS_SUMMARY,
  LANDSCAPE_CARDS,
  TOP_PATTERNS,
  TREND_MONTHS,
  USE_CASES,
} from "../insightsData";
import iconTickerDown from "../assets/public/icon-arrow-up.svg";
import iconTickerUp from "../assets/insights/icon-ticker-up.svg";
import { useDevOverride } from "../devtools";
import { DashboardZeroState } from "./DashboardZeroState";
import { IndiaCirclesMap } from "./IndiaCirclesMap";
import { InsightsAiSection } from "./InsightsAiSection";
import { InsightsAiWidget } from "./InsightsAiWidget";
import { formatDateRange, InsightsDateRange, type DateRange } from "./InsightsDateRange";
import { InsightsWidgetTitle } from "./InsightsWidgetTitle";

type InsightsPageProps = {
  onAnalyze?: (excerpt: string) => void;
  onExplore?: () => void;
  onOpenReports?: () => void;
  onRequestCdrExport?: (periodLabel: string) => void;
};

const LANDSCAPE_WIDGET_IDS = ["landscape-users", "landscape-modus", "landscape-scammer"] as const;

const INSIGHTS_TABS = [
  { id: "landscape", label: "Landscape" },
  { id: "trends", label: "Trends" },
  { id: "patterns", label: "Patterns" },
] as const;

type InsightsTab = (typeof INSIGHTS_TABS)[number]["id"];

export function InsightsPage({
  onAnalyze,
  onExplore,
  onOpenReports,
  onRequestCdrExport,
}: InsightsPageProps) {
  const [range, setRange] = useState<DateRange>({ start: "2026-07-01", end: "2026-07-31" });
  const [tab, setTab] = useState<InsightsTab>("landscape");
  const [cdrToastOpen, setCdrToastOpen] = useState(false);
  const period = formatDateRange(range);
  const dataVolume = useDevOverride<"none" | "typical">("insights.data", "typical");
  const isEmpty = dataVolume === "none";

  useEffect(() => {
    if (!cdrToastOpen) return;
    const timer = window.setTimeout(() => setCdrToastOpen(false), 6000);
    return () => window.clearTimeout(timer);
  }, [cdrToastOpen]);

  function requestCdrExport() {
    onRequestCdrExport?.(period);
    setCdrToastOpen(true);
  }

  function openReports() {
    setCdrToastOpen(false);
    onOpenReports?.();
  }

  return (
    <div className={`main-inner is-insights${isEmpty ? " is-insights-empty" : ""}`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="insights-subtitle">
            {INSIGHTS_SUMMARY.tenant} · {INSIGHTS_SUMMARY.subtitle}
          </p>
        </div>
        <div className="insights-actions">
          <InsightsDateRange value={range} onChange={setRange} />
          <button type="button" className="btn-cancel" onClick={requestCdrExport}>
            Download CDR
          </button>
        </div>
      </div>

      {cdrToastOpen ? (
        <div className="insights-toast" role="status" aria-live="polite">
          <div className="insights-toast-body">
            <p>Your report will be ready for download soon. Go to Reports to download them.</p>
            <button type="button" className="insights-toast-link" onClick={openReports}>
              Open Reports
            </button>
          </div>
          <button
            type="button"
            className="insights-toast-dismiss"
            aria-label="Dismiss"
            onClick={() => setCdrToastOpen(false)}
          >
            ×
          </button>
        </div>
      ) : null}

      {isEmpty ? (
        <DashboardZeroState onExplore={() => onExplore?.()} />
      ) : (
        <>
      <section className="metrics insights-metrics" aria-label="Executive summary">
        <InsightsAiWidget widgetId="users-protected" period={period} className="metric-card">
          <InsightsWidgetTitle widgetId="users-protected" className="metric-label">
            Users Protected
          </InsightsWidgetTitle>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.usersProtected}</p>
            <span className="metric-trend is-up">
              <img src={iconTickerUp} alt="" width={12} height={12} />
              <span>{INSIGHTS_SUMMARY.usersProtectedDelta}</span>
            </span>
          </div>
        </InsightsAiWidget>
        <InsightsAiWidget widgetId="smishing-attacks" period={period} className="metric-card">
          <InsightsWidgetTitle widgetId="smishing-attacks" className="metric-label">
            Smishing Attacks
          </InsightsWidgetTitle>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.smishingAttacks}</p>
            <span className="metric-trend is-warn">
              <img src={iconTickerDown} alt="" width={12} height={12} />
              <span>{INSIGHTS_SUMMARY.channelDelta}</span>
            </span>
          </div>
        </InsightsAiWidget>
        <InsightsAiWidget widgetId="impersonations-blocked" period={period} className="metric-card">
          <InsightsWidgetTitle widgetId="impersonations-blocked" className="metric-label">
            Impersonations Blocked
          </InsightsWidgetTitle>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.impersonationsBlocked}</p>
            <span className="metric-trend is-down">
              <img src={iconTickerDown} alt="" width={12} height={12} />
              <span>{INSIGHTS_SUMMARY.impersonationsDelta}</span>
            </span>
          </div>
        </InsightsAiWidget>
        <InsightsAiWidget widgetId="customer-complaints" period={period} className="metric-card">
          <InsightsWidgetTitle widgetId="customer-complaints" className="metric-label">
            Customer Complaints
          </InsightsWidgetTitle>
          <div className="metric-row">
            <p className="metric-value">{INSIGHTS_SUMMARY.customerComplaints}</p>
            <span className="metric-trend is-down">
              <img src={iconTickerDown} alt="" width={12} height={12} />
              <span>{INSIGHTS_SUMMARY.complaintsDelta}</span>
            </span>
          </div>
        </InsightsAiWidget>
      </section>

      <div className="insights-layout">
        <div className="insights-layout-main">
        <div className="tabs insights-tabs" role="tablist" aria-label="Dashboard categories">
          {INSIGHTS_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`insights-tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`insights-panel-${item.id}`}
              className={`tab${tab === item.id ? " is-active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "trends" ? (
        <section
          className="insights-grid-2"
          role="tabpanel"
          id="insights-panel-trends"
          aria-labelledby="insights-tab-trends"
        >
          <InsightsAiWidget widgetId="protection-trend" period={period} className="chart-card insights-chart-card">
            <div className="chart-header">
              <InsightsWidgetTitle widgetId="protection-trend" className="chart-title">
                Protection trend · Feb–Jul 2026
              </InsightsWidgetTitle>
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
            <InsightsWidgetTitle widgetId="channel-split" className="insights-card-title">
              Channel split · {period}
            </InsightsWidgetTitle>
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
        ) : null}

        {tab === "landscape" ? (
        <div
          className="insights-tab-panel"
          role="tabpanel"
          id="insights-panel-landscape"
          aria-labelledby="insights-tab-landscape"
        >
        <section className="insights-grid-3">
          {LANDSCAPE_CARDS.map((card, index) => (
            <InsightsAiWidget
              key={card.title}
              widgetId={LANDSCAPE_WIDGET_IDS[index]}
              period={period}
              className="metric-card insights-side-card"
            >
              <InsightsWidgetTitle widgetId={LANDSCAPE_WIDGET_IDS[index]} className="insights-card-title">
                {card.title}
              </InsightsWidgetTitle>
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
            <InsightsWidgetTitle widgetId="use-case-mix" className="insights-card-title">
              Use case mix · A2P vs P2P
            </InsightsWidgetTitle>
            <div className="insights-use-cases">
              {USE_CASES.map((item) => (
                <div key={item.label} className="insights-use-case">
                  <div className="insights-use-case-head">
                    <span>{item.label}</span>
                    <strong>{item.detail}</strong>
                  </div>
                  <div className="insights-use-case-track" aria-hidden="true">
                    <div
                      className="insights-use-case-fill is-p2p"
                      style={{ width: `${item.p2p}%`, zIndex: item.p2p <= item.a2p ? 2 : 1 }}
                    />
                    <div
                      className="insights-use-case-fill is-a2p"
                      style={{ width: `${item.a2p}%`, zIndex: item.a2p <= item.p2p ? 2 : 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </InsightsAiWidget>
        </section>
        </div>
        ) : null}

        {tab === "patterns" ? (
        <div
          className="insights-tab-panel"
          role="tabpanel"
          id="insights-panel-patterns"
          aria-labelledby="insights-tab-patterns"
        >
        <InsightsAiWidget widgetId="top-patterns" period={period} className="table-card insights-table-card">
          <InsightsWidgetTitle widgetId="top-patterns" className="insights-card-title is-table">
            Top scam patterns · {period}
          </InsightsWidgetTitle>
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
            <InsightsWidgetTitle widgetId="cta-intelligence" className="chart-title">
              CTA intelligence · {period}
            </InsightsWidgetTitle>
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
        ) : null}
        </div>
        <InsightsAiSection className="is-rail" />
      </div>
        </>
      )}
    </div>
  );
}

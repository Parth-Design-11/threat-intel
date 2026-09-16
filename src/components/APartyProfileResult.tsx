import type { ReactNode } from "react";
import { assets } from "../assets";
import { useDevOverride } from "../devtools";
import {
  A_PARTY_PROFILE,
  A_PARTY_PROFILE_NO_EVIDENCE,
  maskIdentifier,
  resolvePhoneResultState,
  type ProfileMetric,
} from "../exploreData";
import { ExploreZeroState } from "./ExploreZeroState";
import { RiskSpiderChart } from "./RiskSpiderChart";

type APartyProfileResultProps = {
  query: string;
  onBack: () => void;
};

function AlertGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#dc2626" />
      <path d="M8 4.4v5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r="0.85" fill="#fff" />
    </svg>
  );
}

function WarningGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2.2 14.6 13.6H1.4L8 2.2Z" fill="#d97706" />
      <path d="M8 6.2v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.7" r="0.8" fill="#fff" />
    </svg>
  );
}

function Metric({ item }: { item: ProfileMetric }) {
  const reason = item.alert ?? item.hint;
  const showAlert = item.tone === "risk";
  const showWarning = item.tone === "moderate";

  return (
    <div className="profile-metric">
      <dt>
        {item.label}
        {item.hint ? (
          <span className="profile-hint" title={item.hint}>
            <img src={assets.iconInfo} alt="" width={14} height={14} />
          </span>
        ) : null}
      </dt>
      <dd>
        {item.value}
        {showAlert || showWarning ? (
          <span
            className={`profile-metric-flag${showAlert ? " is-alert" : " is-warning"}`}
            tabIndex={0}
            aria-label={reason ?? (showAlert ? "Alert" : "Warning")}
          >
            {showAlert ? <AlertGlyph /> : <WarningGlyph />}
            {reason ? (
              <span className="profile-metric-tip" role="tooltip">
                {reason}
              </span>
            ) : null}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function Section({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`profile-card${className ? ` ${className}` : ""}`}>
      <header className="profile-card-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      {children}
    </article>
  );
}

export function APartyProfileResult({ query, onBack }: APartyProfileResultProps) {
  const masked = maskIdentifier(query);
  const state = useDevOverride("explore.aParty", resolvePhoneResultState(query));

  if (state === "zero") {
    return (
      <div className="main-inner is-result">
        <header className="result-header">
          <button type="button" className="result-back" onClick={onBack} aria-label="Back to search">
            <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
          </button>
          <div className="result-heading">
            <h1 className="result-title">{masked}</h1>
            <p className="result-meta">
              <span className="result-meta-icon">
                <img src={assets.iconUser} alt="" width={16} height={16} />
              </span>
              Sender
            </p>
          </div>
        </header>
        <ExploreZeroState
          title="No intelligence found"
          description="This phone number hasn't been observed in scam, phishing, or fraud campaigns across our threat network."
          hint="Try a different number or check back as new signals are ingested daily."
        />
      </div>
    );
  }

  const profile = state === "no-evidence" ? A_PARTY_PROFILE_NO_EVIDENCE : A_PARTY_PROFILE;

  return (
    <div className="main-inner is-result is-profile">
      <header className="result-header">
        <button type="button" className="result-back" onClick={onBack} aria-label="Back to search">
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title">{masked}</h1>
          <p className="result-meta">
            <span className="result-meta-icon">
              <img src={assets.iconUser} alt="" width={16} height={16} />
            </span>
            Sender profile
            {state === "no-evidence" ? (
              <span className="result-status-badge is-no-evidence">No evidence</span>
            ) : null}
          </p>
        </div>
      </header>

      <div className="profile-layout">
        <div className="profile-stack">
        <Section
          title="Registration & identity"
          description="Device-identity consistency for this MSISDN — not subscriber name matching."
        >
          <dl className="profile-metrics">
            <Metric item={profile.identity.verdict} />
            {profile.identity.metrics.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </Section>

        <Section title="Vintage / tenure">
          <dl className="profile-metrics">
            {profile.vintage.metrics.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </Section>

        <Section
          title="Identity volatility"
          description="SIM and device-signature churn. Stronger than name-change tracking in a KYC-light market."
        >
          <dl className="profile-metrics">
            {profile.volatility.metrics.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </Section>

        <Section title="Stability" description="Number recycling via deactivation and reissue tracking.">
          <dl className="profile-metrics">
            {profile.stability.metrics.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </Section>

        <Section title="Behavioral activity" description="Content-classified traffic, not just call counts.">
          <dl className="profile-metrics">
            {profile.activity.metrics.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
          <div className="profile-table-wrap">
            <table className="profile-window-table">
              <thead>
                <tr>
                  <th />
                  <th>Last 30 days</th>
                  <th>Last 60 days</th>
                  <th>Last 90 days</th>
                </tr>
              </thead>
              <tbody>
                {profile.activity.windows.map((row) => (
                  <tr key={row.label}>
                    <th>
                      {row.label}
                      {row.hint ? (
                        <span className="profile-hint" title={row.hint}>
                          <img src={assets.iconInfo} alt="" width={14} height={14} />
                        </span>
                      ) : null}
                    </th>
                    {row.values.map((value, index) => (
                      <td key={`${row.label}-${index}`}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="Content-based threat signals"
          description="Direct evidence of what was sent — classification, patterns, and scam mix."
        >
          <dl className="profile-metrics">
            {profile.content.metrics.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </Section>

        <Section
          title="Network association"
          description={`Early-warning layer via ${profile.network.signature}. Numbers that have not scammed yet can still share a device or location signature with known scammers.`}
        >
          <dl className="profile-metrics">
            {profile.network.metrics.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </Section>
        </div>

        <aside className="profile-risk-col">
          <Section title="Composite risk score" className="is-chart">
            <div className="profile-risk-row">
              <RiskSpiderChart
                score={profile.risk.score}
                label={profile.risk.label}
                tone={profile.risk.tone}
                axes={profile.risk.weights.map((row) => ({
                  label: row.label,
                  strength: row.strength,
                  value: row.value,
                  threshold: row.threshold,
                  thresholdStrength: row.thresholdStrength,
                }))}
              />
            </div>
          </Section>
        </aside>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { assets } from "../assets";
import type { BPartyProfile, ProfileMetric } from "../exploreData";
import { ThreatScoreCard } from "./ThreatScoreCard";

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

type BPartyExposureSummaryProps = {
  profile: BPartyProfile;
  className?: string;
  /** Extra left-column sections (timeline, attackers, etc.) that sit under Exposure. */
  children?: ReactNode;
};

/** Exposure summary metrics + vulnerability gauge (shared by Explore Vulnerability and Evidence). */
export function BPartyExposureSummary({ profile, className, children }: BPartyExposureSummaryProps) {
  return (
    <div className={`profile-layout${className ? ` ${className}` : ""}`}>
      <div className="profile-stack">
        <Section title="Exposure summary" description="Inbound attack pressure against this MSISDN.">
          <dl className="profile-metrics">
            {profile.stats.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </Section>
        {children}
      </div>

      <aside className="profile-risk-col">
        <Section title="Vulnerability score" className="is-gauge">
          <div className="b-party-gauge">
            <ThreatScoreCard
              score={profile.vulnerability.score}
              label={profile.vulnerability.label}
              bare
            />
          </div>
        </Section>
      </aside>
    </div>
  );
}

import type { ReactNode } from "react";
import { assets } from "../assets";
import { useDevOverride } from "../devtools";
import {
  B_PARTY_PROFILE,
  B_PARTY_PROFILE_NO_EVIDENCE,
  maskIdentifier,
  resolveBPartyResultState,
  type ProfileMetric,
} from "../exploreData";
import { ExploreZeroState } from "./ExploreZeroState";
import type { PartyMode } from "./PartyModeToggle";
import { ResultPartyHeader } from "./ResultPartyHeader";
import { ThreatScoreCard } from "./ThreatScoreCard";

type BPartyProfileResultProps = {
  query: string;
  onBack: () => void;
  partyMode: PartyMode;
  onPartyModeChange: (mode: PartyMode) => void;
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

export function BPartyProfileResult({
  query,
  onBack,
  partyMode,
  onPartyModeChange,
}: BPartyProfileResultProps) {
  const masked = maskIdentifier(query);
  const state = useDevOverride("explore.bParty", resolveBPartyResultState(query));

  if (state === "zero") {
    return (
      <div className="main-inner is-result">
        <ResultPartyHeader
          title={masked}
          onBack={onBack}
          partyMode={partyMode}
          onPartyModeChange={onPartyModeChange}
          meta={
            <>
              <span className="result-meta-icon">
                <img src={assets.iconUser} alt="" width={16} height={16} />
              </span>
              Receiver
            </>
          }
        />
        <ExploreZeroState
          title="No vulnerability intelligence"
          description="This phone number hasn't been observed as a receiver in scam, phishing, or fraud campaigns across our threat network."
          hint="Try a different number or check back as new signals are ingested daily."
        />
      </div>
    );
  }

  const profile = state === "no-evidence" ? B_PARTY_PROFILE_NO_EVIDENCE : B_PARTY_PROFILE;

  return (
    <div className="main-inner is-result is-profile">
      <ResultPartyHeader
        title={masked}
        onBack={onBack}
        partyMode={partyMode}
        onPartyModeChange={onPartyModeChange}
        meta={
          <>
            <span className="result-meta-icon">
              <img src={assets.iconUser} alt="" width={16} height={16} />
            </span>
            Receiver vulnerability
            {state === "no-evidence" ? (
              <span className="result-status-badge is-no-evidence">No evidence</span>
            ) : null}
          </>
        }
      />

      <div className="profile-layout">
        <div className="profile-stack">
          <Section title="Exposure summary" description="Inbound attack pressure against this MSISDN.">
            <dl className="profile-metrics">
              {profile.stats.map((item) => (
                <Metric key={item.label} item={item} />
              ))}
            </dl>
          </Section>

          <Section title="Attack timeline" description="Recent inbound attempts linked to this receiver.">
            {profile.timeline.length === 0 ? (
              <p className="profile-empty-copy">No attack events in evidence.</p>
            ) : (
              <ol className="b-party-timeline">
                {profile.timeline.map((event) => (
                  <li key={event.id} className="b-party-timeline-item">
                    <div className="b-party-timeline-when">{event.at}</div>
                    <div className="b-party-timeline-body">
                      <strong>{event.channel}</strong>
                      <span className="b-party-timeline-attacker">{event.attacker}</span>
                      <p>{event.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Section>

          <Section title="Top attackers" description="A-parties most often targeting this number.">
            {profile.attackers.length === 0 ? (
              <p className="profile-empty-copy">No attacker breakdown available.</p>
            ) : (
              <div className="profile-table-wrap">
                <table className="profile-window-table">
                  <thead>
                    <tr>
                      <th>A-party</th>
                      <th>Attacks</th>
                      <th>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.attackers.map((row) => (
                      <tr key={row.id}>
                        <th>{row.display}</th>
                        <td>{row.attackCount}</td>
                        <td>{row.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          <Section title="Channels & patterns" description="How inbound pressure arrives and what templates dominate.">
            {profile.channels.length === 0 ? (
              <p className="profile-empty-copy">No channel mix in evidence.</p>
            ) : (
              <div className="profile-table-wrap">
                <table className="profile-window-table">
                  <thead>
                    <tr>
                      <th>Channel</th>
                      <th>Pattern</th>
                      <th>Count</th>
                      <th>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.channels.map((row) => (
                      <tr key={`${row.channel}-${row.pattern}`}>
                        <th>{row.channel}</th>
                        <td>{row.pattern}</td>
                        <td>{row.count}</td>
                        <td>{row.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
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
    </div>
  );
}

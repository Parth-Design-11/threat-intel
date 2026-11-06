import { assets } from "../assets";
import { useDevOverride } from "../devtools";
import {
  B_PARTY_PROFILE,
  B_PARTY_PROFILE_NO_EVIDENCE,
  maskIdentifier,
  resolveBPartyResultState,
} from "../exploreData";
import { BPartyExposureSummary } from "./BPartyExposureSummary";
import { ExploreZeroState } from "./ExploreZeroState";
import type { PartyMode } from "./PartyModeToggle";
import { ResultPartyHeader } from "./ResultPartyHeader";

type BPartyProfileResultProps = {
  query: string;
  onBack: () => void;
  partyMode: PartyMode;
  onPartyModeChange: (mode: PartyMode) => void;
};

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

      <BPartyExposureSummary profile={profile}>
        <article className="profile-card">
          <header className="profile-card-head">
            <h2>Attack timeline</h2>
            <p>Recent inbound attempts linked to this receiver.</p>
          </header>
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
        </article>

        <article className="profile-card">
          <header className="profile-card-head">
            <h2>Top attackers</h2>
            <p>A-parties most often targeting this number.</p>
          </header>
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
        </article>

        <article className="profile-card">
          <header className="profile-card-head">
            <h2>Channels & patterns</h2>
            <p>How inbound pressure arrives and what templates dominate.</p>
          </header>
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
        </article>
      </BPartyExposureSummary>
    </div>
  );
}

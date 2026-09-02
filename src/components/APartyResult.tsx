import { assets } from "../assets";
import {
  A_PARTY_DETAILS,
  A_PARTY_EVIDENCES,
  A_PARTY_NO_EVIDENCE_DETAILS,
  A_PARTY_RELATED,
  maskIdentifier,
  resolvePhoneResultState,
} from "../exploreData";
import { ExploreZeroState } from "./ExploreZeroState";
import { ResultEmptyPanel } from "./ResultEmptyPanel";
import { ThreatScoreCard } from "./ThreatScoreCard";

type APartyResultProps = {
  query: string;
  onBack: () => void;
};

export function APartyResult({ query, onBack }: APartyResultProps) {
  const masked = maskIdentifier(query);
  const state = resolvePhoneResultState(query);

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

  const details = state === "no-evidence" ? A_PARTY_NO_EVIDENCE_DETAILS : A_PARTY_DETAILS;
  const evidences = state === "no-evidence" ? [] : A_PARTY_EVIDENCES;
  const related = state === "no-evidence" ? [] : A_PARTY_RELATED;

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
            {state === "no-evidence" ? (
              <span className="result-status-badge is-no-evidence">No evidence</span>
            ) : null}
          </p>
        </div>
      </header>

      <div className="result-layout">
        <div className="result-main">
          <article className="result-card">
            <div className="result-card-head">Asset Details</div>
            <dl className="asset-grid">
              <div className="asset-field">
                <dt>Asset Value</dt>
                <dd>{masked}</dd>
              </div>
              <div className="asset-field">
                <dt>Asset Type</dt>
                <dd className="asset-type">
                  <img src={assets.iconUser} alt="" width={16} height={16} />
                  {details.assetType}
                </dd>
              </div>
              <div className="asset-field">
                <dt>Identified on</dt>
                <dd>{details.identifiedOn}</dd>
              </div>
              <div className="asset-field">
                <dt>Origin Telecom</dt>
                <dd>{details.originTelecom}</dd>
              </div>
              <div className="asset-field">
                <dt>Evidences</dt>
                <dd>{details.evidences}</dd>
              </div>
              <div className="asset-field">
                <dt>Total Attack Counts</dt>
                <dd>{details.totalAttackCounts}</dd>
              </div>
              <div className="asset-field">
                <dt>CTAs Used</dt>
                <dd>{details.ctasUsed}</dd>
              </div>
              <div className="asset-field">
                <dt>First observed</dt>
                <dd>{details.firstObserved}</dd>
              </div>
              <div className="asset-field">
                <dt>Last observed</dt>
                <dd>{details.lastObserved}</dd>
              </div>
            </dl>
          </article>

          <article className="result-card">
            <div className="result-card-head">Evidences</div>
            {evidences.length === 0 ? (
              <ResultEmptyPanel
                title="No evidences yet"
                description="This sender is indexed but no message templates or CTAs have been linked to it."
              />
            ) : (
              <div className="evidence-scroll">
                <div className="evidence-table">
                  <div className="evidence-thead">
                    <span>S.No</span>
                    <span>Message Template</span>
                    <span>CTA Value</span>
                    <span>Attack counts</span>
                    <span>Users affected</span>
                    <span>First observed</span>
                    <span>Last observed</span>
                    <span>Channels</span>
                    <span>Use Case</span>
                  </div>
                  {evidences.map((row) => (
                    <div key={row.id} className="evidence-row">
                      <span>{row.id}</span>
                      <span className="cell-ellipsis" title={row.template}>
                        {row.template}
                      </span>
                      <span className="cell-ellipsis" title={row.cta}>
                        {row.cta}
                      </span>
                      <span>{row.attackCounts}</span>
                      <span>{row.usersAffected}</span>
                      <span>{row.firstObserved}</span>
                      <span>{row.lastObserved}</span>
                      <span>{row.channel}</span>
                      <span>{row.useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <aside className="result-aside">
          {state === "full" ? (
            <ThreatScoreCard score={A_PARTY_DETAILS.threatScore} label={A_PARTY_DETAILS.threatLabel} />
          ) : null}
          <article className="result-card related-card">
            <div className="result-card-head">Related Assets</div>
            {related.length === 0 ? (
              <ResultEmptyPanel
                title="No related assets"
                description="URLs, patterns, and other assets will appear here when evidence is collected."
              />
            ) : (
              <ul className="related-list">
                {related.map((asset) => (
                  <li key={asset.id} className="related-item">
                    <p className="related-url">{asset.value}</p>
                    <p className="related-meta">
                      <img src={assets.iconLink} alt="" width={16} height={16} />
                      <span>{asset.kind}</span>
                      <span className="related-dot" />
                      <span>Reported by {asset.reportedBy}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </aside>
      </div>
    </div>
  );
}

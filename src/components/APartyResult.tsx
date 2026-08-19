import { assets } from "../assets";
import {
  A_PARTY_DETAILS,
  A_PARTY_EVIDENCES,
  A_PARTY_RELATED,
  maskIdentifier,
  type EvidenceConfidence,
} from "../exploreData";

type APartyResultProps = {
  query: string;
  onBack: () => void;
};

function confidenceClass(level: EvidenceConfidence) {
  if (level === "HIGH") return "is-conf-high";
  if (level === "LOW") return "is-conf-low";
  return "is-conf-medium";
}

export function APartyResult({ query, onBack }: APartyResultProps) {
  const masked = maskIdentifier(query);

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
                  {A_PARTY_DETAILS.assetType}
                </dd>
              </div>
              <div className="asset-field">
                <dt>Identified on</dt>
                <dd>{A_PARTY_DETAILS.identifiedOn}</dd>
              </div>
              <div className="asset-field">
                <dt>Origin Telecom</dt>
                <dd>{A_PARTY_DETAILS.originTelecom}</dd>
              </div>
              <div className="asset-field">
                <dt>Evidences</dt>
                <dd>{A_PARTY_DETAILS.evidences}</dd>
              </div>
              <div className="asset-field">
                <dt>Total Attack Counts</dt>
                <dd>{A_PARTY_DETAILS.totalAttackCounts}</dd>
              </div>
              <div className="asset-field">
                <dt>CTAs Used</dt>
                <dd>{A_PARTY_DETAILS.ctasUsed}</dd>
              </div>
              <div className="asset-field">
                <dt>First observed</dt>
                <dd>{A_PARTY_DETAILS.firstObserved}</dd>
              </div>
              <div className="asset-field">
                <dt>Last observed</dt>
                <dd>{A_PARTY_DETAILS.lastObserved}</dd>
              </div>
            </dl>
          </article>

          <article className="result-card">
            <div className="result-card-head">Evidences</div>
            <div className="evidence-scroll">
              <div className="evidence-table">
                <div className="evidence-thead">
                  <span>S.No</span>
                  <span>Message Template</span>
                  <span>CTA Value</span>
                  <span>Confidence</span>
                  <span>Attack counts</span>
                  <span>Users affected</span>
                  <span>First observed</span>
                  <span>Last observed</span>
                  <span>Channels</span>
                  <span>Use Case</span>
                </div>
                {A_PARTY_EVIDENCES.map((row) => (
                  <div key={row.id} className="evidence-row">
                    <span>{row.id}</span>
                    <span className="cell-ellipsis" title={row.template}>
                      {row.template}
                    </span>
                    <span className="cell-ellipsis" title={row.cta}>
                      {row.cta}
                    </span>
                    <span>
                      <span className={`badge ${confidenceClass(row.confidence)}`}>
                        {row.confidence}
                      </span>
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
          </article>
        </div>

        <aside className="result-card related-card">
          <div className="result-card-head">Related Assets</div>
          <ul className="related-list">
            {A_PARTY_RELATED.map((asset) => (
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
        </aside>
      </div>
    </div>
  );
}

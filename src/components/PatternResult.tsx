import { assets } from "../assets";
import {
  PATTERN_DETAILS,
  PATTERN_RELATED,
  PATTERN_SENDERS,
  displayQuery,
  type EvidenceConfidence,
  type RelatedAsset,
} from "../exploreData";

type PatternResultProps = {
  query: string;
  onBack: () => void;
};

function confidenceClass(level: EvidenceConfidence) {
  if (level === "HIGH") return "is-conf-high";
  if (level === "LOW") return "is-conf-low";
  return "is-conf-medium";
}

function relatedIcon(kind: RelatedAsset["kind"]) {
  return kind === "URL" ? assets.iconLink : assets.iconMessage;
}

export function PatternResult({ query, onBack }: PatternResultProps) {
  const title = displayQuery(query);

  return (
    <div className="main-inner is-result">
      <header className="result-header">
        <button type="button" className="result-back" onClick={onBack} aria-label="Back to search">
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title is-message" title={query}>
            {title}
          </h1>
          <p className="result-meta">
            <span className="result-meta-icon">
              <img src={assets.iconMessage} alt="" width={16} height={16} />
            </span>
            Message Pattern
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
                <dd className="cell-ellipsis" title={query}>
                  {title}
                </dd>
              </div>
              <div className="asset-field">
                <dt>Asset Type</dt>
                <dd className="asset-type">
                  <img src={assets.iconMessage} alt="" width={16} height={16} />
                  {PATTERN_DETAILS.assetType}
                </dd>
              </div>
              <div className="asset-field">
                <dt>Identified on</dt>
                <dd>{PATTERN_DETAILS.identifiedOn}</dd>
              </div>
              <div className="asset-field">
                <dt>Pattern families</dt>
                <dd>{PATTERN_DETAILS.families}</dd>
              </div>
              <div className="asset-field">
                <dt>Related Senders</dt>
                <dd>{PATTERN_DETAILS.relatedSenders}</dd>
              </div>
              <div className="asset-field">
                <dt>Total Attack Counts</dt>
                <dd>{PATTERN_DETAILS.totalAttackCounts}</dd>
              </div>
              <div className="asset-field">
                <dt>Channels</dt>
                <dd>{PATTERN_DETAILS.channels}</dd>
              </div>
              <div className="asset-field">
                <dt>First observed</dt>
                <dd>{PATTERN_DETAILS.firstObserved}</dd>
              </div>
              <div className="asset-field">
                <dt>Last observed</dt>
                <dd>{PATTERN_DETAILS.lastObserved}</dd>
              </div>
            </dl>
          </article>

          <article className="result-card">
            <div className="result-card-head">Related Senders</div>
            <div className="evidence-scroll">
              <div className="evidence-table is-pattern">
                <div className="evidence-thead">
                  <span>S.No</span>
                  <span>Sender</span>
                  <span>Origin Telecom</span>
                  <span>Confidence</span>
                  <span>Attack counts</span>
                  <span>Users affected</span>
                  <span>First observed</span>
                  <span>Last observed</span>
                  <span>Channels</span>
                  <span>Use Case</span>
                </div>
                {PATTERN_SENDERS.map((row) => (
                  <div key={row.id} className="evidence-row">
                    <span>{row.id}</span>
                    <span className="cell-ellipsis" title={row.sender}>
                      {row.sender}
                    </span>
                    <span>{row.telecom}</span>
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
            {PATTERN_RELATED.map((asset) => (
              <li key={asset.id} className="related-item">
                <p className="related-url">{asset.value}</p>
                <p className="related-meta">
                  <img src={relatedIcon(asset.kind)} alt="" width={16} height={16} />
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

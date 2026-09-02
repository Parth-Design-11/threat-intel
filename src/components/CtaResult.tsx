import { assets } from "../assets";
import {
  CTA_DETAILS,
  CTA_MESSAGES,
  CTA_NO_EVIDENCE_DETAILS,
  CTA_RELATED,
  displayQuery,
  resolveCtaResultState,
  type RelatedAsset,
} from "../exploreData";
import { ExploreZeroState } from "./ExploreZeroState";
import { ResultEmptyPanel } from "./ResultEmptyPanel";

type CtaResultProps = {
  query: string;
  onBack: () => void;
};

function relatedIcon(kind: RelatedAsset["kind"]) {
  if (kind === "URL") return assets.iconLink;
  if (kind === "Sender") return assets.iconUser;
  return assets.iconMessage;
}

export function CtaResult({ query, onBack }: CtaResultProps) {
  const title = displayQuery(query);
  const state = resolveCtaResultState(query);

  if (state === "zero") {
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
                <img src={assets.iconLink} alt="" width={16} height={16} />
              </span>
              CTA Check
            </p>
          </div>
        </header>

        <ExploreZeroState
          title="No intelligence found"
          description="This CTA hasn't been observed in scam, phishing, or fraud campaigns across our threat network."
          hint="Try a different URL or message text, or check back as new signals are ingested daily."
        />
      </div>
    );
  }

  const details = state === "no-evidence" ? CTA_NO_EVIDENCE_DETAILS : CTA_DETAILS;
  const messages = state === "no-evidence" ? [] : CTA_MESSAGES;
  const related = state === "no-evidence" ? [] : CTA_RELATED;

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
              <img src={assets.iconLink} alt="" width={16} height={16} />
            </span>
            CTA Check
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
                <dd className="cell-ellipsis" title={query}>
                  {title}
                </dd>
              </div>
              <div className="asset-field">
                <dt>Asset Type</dt>
                <dd className="asset-type">
                  <img src={assets.iconLink} alt="" width={16} height={16} />
                  {details.assetType}
                </dd>
              </div>
              <div className="asset-field">
                <dt>Identified on</dt>
                <dd>{details.identifiedOn}</dd>
              </div>
              <div className="asset-field">
                <dt>CTA Type</dt>
                <dd>{details.ctaType}</dd>
              </div>
              <div className="asset-field">
                <dt>Related Messages</dt>
                <dd>{details.relatedMessages}</dd>
              </div>
              <div className="asset-field">
                <dt>Total Attack Counts</dt>
                <dd>{details.totalAttackCounts}</dd>
              </div>
              <div className="asset-field">
                <dt>Channels</dt>
                <dd>{details.channels}</dd>
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
            <div className="result-card-head">Related Messages</div>
            {messages.length === 0 ? (
              <ResultEmptyPanel
                title="No related messages"
                description="This CTA is indexed but no message templates or senders have been linked to it yet."
              />
            ) : (
              <div className="evidence-scroll">
                <div className="evidence-table">
                  <div className="evidence-thead">
                    <span>S.No</span>
                    <span>Message Template</span>
                    <span>Sender</span>
                    <span>Attack counts</span>
                    <span>Users affected</span>
                    <span>First observed</span>
                    <span>Last observed</span>
                    <span>Channels</span>
                    <span>Use Case</span>
                  </div>
                  {messages.map((row) => (
                    <div key={row.id} className="evidence-row">
                      <span>{row.id}</span>
                      <span className="cell-ellipsis" title={row.template}>
                        {row.template}
                      </span>
                      <span className="cell-ellipsis" title={row.sender}>
                        {row.sender}
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

        <aside className="result-card related-card">
          <div className="result-card-head">Related Assets</div>
          {related.length === 0 ? (
            <ResultEmptyPanel
              title="No related assets"
              description="Senders, patterns, and URLs will appear here when evidence is collected."
            />
          ) : (
            <ul className="related-list">
              {related.map((asset) => (
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
          )}
        </aside>
      </div>
    </div>
  );
}

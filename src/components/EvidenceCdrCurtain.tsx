import { useEffect, useState } from "react";
import { assets } from "../assets";
import {
  resolveEvidencePatternDetail,
  type EvidenceCdrRow,
} from "../evidenceData";
import type { EvidenceConfidence, RelatedAsset } from "../exploreData";

export type EvidenceCdrReviewDecision = "approved" | "rejected";

type EvidenceCdrCurtainProps = {
  row: EvidenceCdrRow;
  onClose: () => void;
  /** Bulk-upload review actions for this CDR. */
  showReviewActions?: boolean;
  reviewDecision?: EvidenceCdrReviewDecision | null;
  onReview?: (decision: EvidenceCdrReviewDecision) => void;
};

function confidenceClass(level: EvidenceConfidence) {
  if (level === "HIGH") return "is-conf-high";
  if (level === "LOW") return "is-conf-low";
  return "is-conf-medium";
}

function relatedIcon(kind: RelatedAsset["kind"]) {
  return kind === "URL" ? assets.iconLink : assets.iconMessage;
}

export function EvidenceCdrCurtain({
  row,
  onClose,
  showReviewActions = false,
  reviewDecision = null,
  onReview,
}: EvidenceCdrCurtainProps) {
  const [entered, setEntered] = useState(false);
  const detail = resolveEvidencePatternDetail(row.pattern.id);
  const pattern = row.pattern;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        className={`overlay insights-ai-overlay${entered ? " is-visible" : ""}`}
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className={`insights-ai-curtain evidence-cdr-curtain${entered ? " is-open" : ""}`}
        role="dialog"
        aria-labelledby="evidence-cdr-curtain-title"
      >
        <button type="button" className="insights-ai-close" aria-label="Close" onClick={onClose}>
          <img src={assets.iconClose} alt="" width={16} height={16} />
        </button>

        <div className="insights-ai-curtain-inner evidence-cdr-curtain-inner">
          <header className="evidence-cdr-curtain-head">
            <p className="evidence-cdr-curtain-kicker">CDR record</p>
            <h2 id="evidence-cdr-curtain-title" className="evidence-cdr-curtain-title">
              {row.referenceId}
            </h2>
            <p className="evidence-cdr-curtain-meta">
              {row.timestamp}
              <span className={`evidence-cdr-tag is-${row.identifiedAs.toLowerCase()}`}>
                {row.identifiedAs}
              </span>
            </p>
          </header>

          <div className="evidence-cdr-curtain-scroll">
            <section className="evidence-cdr-curtain-card">
              <h3>Record details</h3>
              <dl className="evidence-cdr-curtain-grid">
                <div>
                  <dt>Sender</dt>
                  <dd>{row.sender}</dd>
                </div>
                <div>
                  <dt>Time stamp</dt>
                  <dd>{row.timestamp}</dd>
                </div>
                <div>
                  <dt>Identified as</dt>
                  <dd>{row.identifiedAs}</dd>
                </div>
                <div>
                  <dt>Reference ID</dt>
                  <dd>{row.referenceId}</dd>
                </div>
              </dl>
            </section>

            <section className="evidence-cdr-curtain-card">
              <h3>Message pattern</h3>
              <p className="evidence-cdr-pattern">{pattern.excerpt}</p>
              <dl className="evidence-cdr-curtain-grid">
                <div>
                  <dt>Pattern families</dt>
                  <dd>{pattern.families}</dd>
                </div>
                <div>
                  <dt>Use case</dt>
                  <dd>{pattern.useCase}</dd>
                </div>
                <div>
                  <dt>Channels</dt>
                  <dd>{pattern.channels}</dd>
                </div>
                <div>
                  <dt>Identified on</dt>
                  <dd>{pattern.identifiedOn}</dd>
                </div>
                <div>
                  <dt>Related senders</dt>
                  <dd>{pattern.relatedSenders}</dd>
                </div>
                <div>
                  <dt>Total attack counts</dt>
                  <dd>{pattern.totalAttackCounts}</dd>
                </div>
                <div>
                  <dt>Users affected</dt>
                  <dd>{pattern.usersAffected}</dd>
                </div>
                <div>
                  <dt>First observed</dt>
                  <dd>{pattern.firstObserved}</dd>
                </div>
                <div>
                  <dt>Last observed</dt>
                  <dd>{pattern.lastObserved}</dd>
                </div>
              </dl>
            </section>

            {detail && detail.senders.length > 0 ? (
              <section className="evidence-cdr-curtain-card">
                <h3>Related senders</h3>
                <ul className="evidence-cdr-curtain-list">
                  {detail.senders.map((sender) => (
                    <li key={sender.id}>
                      <div className="evidence-cdr-curtain-list-main">
                        <strong title={sender.sender}>{sender.sender}</strong>
                        <span className={`badge ${confidenceClass(sender.confidence)}`}>
                          {sender.confidence}
                        </span>
                      </div>
                      <p>
                        {sender.telecom} · {sender.channel} · {sender.useCase}
                      </p>
                      <p>
                        {sender.attackCounts} attacks · {sender.usersAffected} users ·{" "}
                        {sender.firstObserved} → {sender.lastObserved}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {detail && detail.related.length > 0 ? (
              <section className="evidence-cdr-curtain-card">
                <h3>Related assets</h3>
                <ul className="evidence-cdr-curtain-assets">
                  {detail.related.map((asset) => (
                    <li key={asset.id}>
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
              </section>
            ) : null}
          </div>

          {showReviewActions ? (
            <footer className="evidence-cdr-curtain-actions">
              {reviewDecision ? (
                <p className={`evidence-cdr-review-status is-${reviewDecision}`}>
                  {reviewDecision === "approved" ? "Approved" : "Rejected"}
                </p>
              ) : null}
              <div className="evidence-cdr-curtain-action-row">
                <button
                  type="button"
                  className="btn-cancel"
                  disabled={reviewDecision === "rejected"}
                  onClick={() => onReview?.("rejected")}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={reviewDecision === "approved"}
                  onClick={() => onReview?.("approved")}
                >
                  Approve
                </button>
              </div>
            </footer>
          ) : null}
        </div>
      </aside>
    </>
  );
}

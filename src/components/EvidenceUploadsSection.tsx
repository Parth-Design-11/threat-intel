import { useMemo, useState } from "react";
import {
  formatEvidenceUploadTime,
  getEvidenceUploads,
  scamShare,
  spamShare,
  threatMessageTotal,
  uploadKindLabel,
  type EvidenceUploadRecord,
} from "../evidenceUploads";

type EvidenceUploadsSectionProps = {
  refreshKey: number;
  onOpenUpload: (record: EvidenceUploadRecord) => void;
  kind?: EvidenceUploadRecord["kind"];
  embedded?: boolean;
};

function DistributionBar({ record }: { record: EvidenceUploadRecord }) {
  const total = threatMessageTotal(record);
  if (total === 0) {
    return <p className="evidence-uploads-dist-empty">No spam or scam messages in matched evidence.</p>;
  }

  const spamPct = spamShare(record);
  const scamPct = scamShare(record);

  return (
    <div className="evidence-uploads-dist">
      <div
        className="evidence-uploads-dist-track"
        role="img"
        aria-label={`Spam ${spamPct}%, Scam ${scamPct}%`}
      >
        <span className="evidence-uploads-dist-spam" style={{ width: `${spamPct}%` }} />
        <span className="evidence-uploads-dist-scam" style={{ width: `${scamPct}%` }} />
      </div>
      <div className="evidence-uploads-dist-legend">
        <span>
          <i className="is-spam" aria-hidden="true" /> Spam {record.spamMessages.toLocaleString()} ({spamPct}%)
        </span>
        <span>
          <i className="is-scam" aria-hidden="true" /> Scam {record.scamMessages.toLocaleString()} ({scamPct}%)
        </span>
      </div>
    </div>
  );
}

export function EvidenceUploadsSection({
  refreshKey,
  onOpenUpload,
  kind,
  embedded = false,
}: EvidenceUploadsSectionProps) {
  const uploads = useMemo(() => {
    const all = getEvidenceUploads();
    return kind ? all.filter((record) => record.kind === kind) : all;
  }, [refreshKey, kind]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section
      className={`evidence-uploads${embedded ? " is-embedded" : ""}`}
      aria-label="Previous uploads"
    >
      {embedded ? null : (
      <div className="evidence-uploads-summary">
        <article className="metric-card">
          <p className="metric-label">Files uploaded</p>
          <div className="metric-row">
            <p className="metric-value">{uploads.length.toLocaleString()}</p>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Evidence rows found</p>
          <div className="metric-row">
            <p className="metric-value">
              {uploads.reduce((sum, row) => sum + row.evidenceFound, 0).toLocaleString()}
            </p>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Spam + scam messages</p>
          <div className="metric-row">
            <p className="metric-value">
              {uploads.reduce((sum, row) => sum + threatMessageTotal(row), 0).toLocaleString()}
            </p>
          </div>
        </article>
      </div>
      )}

      <div className="table-card insights-table-card evidence-uploads-card">
        <div className="evidence-cdr-head">
          <div>
            <h2 className="insights-card-title is-table">Previous uploads</h2>
            <p className="evidence-cdr-lede">
              Files you have uploaded, evidence found per file, and spam vs scam split.
            </p>
          </div>
        </div>

        <div className="table-wrap evidence-uploads-wrap">
          <div className="thead evidence-uploads-row is-head">
            <div className="th">File</div>
            <div className="th">Uploaded</div>
            <div className="th">Scanned</div>
            <div className="th">Evidence</div>
            <div className="th">Spam / scam</div>
            <div className="th is-expand" aria-hidden="true" />
          </div>
          {uploads.length === 0 ? (
            <p className="evidence-uploads-empty">No uploads yet. Use the upload area above to add a file.</p>
          ) : null}
          {uploads.map((record) => {
            const expanded = expandedId === record.id;
            return (
              <div key={record.id} className="evidence-uploads-item">
                <button
                  type="button"
                  className={`trow evidence-uploads-row is-toggle${expanded ? " is-selected" : ""}`}
                  aria-expanded={expanded}
                  onClick={() => setExpandedId((current) => (current === record.id ? null : record.id))}
                >
                  <div className="td">
                    <span className="evidence-uploads-file" title={record.fileName}>
                      {record.fileName}
                    </span>
                    <span className="evidence-uploads-kind">{uploadKindLabel(record.kind)}</span>
                  </div>
                  <div className="td">{formatEvidenceUploadTime(record.uploadedAt)}</div>
                  <div className="td">{record.rowsScanned.toLocaleString()}</div>
                  <div className="td">{record.evidenceFound.toLocaleString()}</div>
                  <div className="td">
                    {record.spamMessages.toLocaleString()} / {record.scamMessages.toLocaleString()}
                  </div>
                  <div className="td is-expand" aria-hidden="true">
                    <span className="evidence-cdr-chevron">›</span>
                  </div>
                </button>
                {expanded ? (
                  <div className="evidence-uploads-detail">
                    <DistributionBar record={record} />
                    <button
                      type="button"
                      className="evidence-uploads-open"
                      onClick={() => onOpenUpload(record)}
                    >
                      Open full results
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
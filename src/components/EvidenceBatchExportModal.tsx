import { useState } from "react";
import { assets } from "../assets";

type EvidenceBatchExportModalProps = {
  fileName: string;
  totalRows: number;
  evidenceRows: number;
  onClose: () => void;
  onConfirm: (onlyWithEvidence: boolean) => void;
};

export function EvidenceBatchExportModal({
  fileName,
  totalRows,
  evidenceRows,
  onClose,
  onConfirm,
}: EvidenceBatchExportModalProps) {
  const [onlyWithEvidence, setOnlyWithEvidence] = useState(false);

  const exportCount = onlyWithEvidence ? evidenceRows : totalRows;

  return (
    <>
      <button type="button" className="overlay" aria-label="Close dialog" onClick={onClose} />
      <div className="modal is-evidence-export" role="dialog" aria-labelledby="evidence-export-title">
        <div className="modal-header">
          <h2 id="evidence-export-title" className="modal-title">
            Download results
          </h2>
          <button type="button" className="close-btn" aria-label="Close" onClick={onClose}>
            <img src={assets.iconClose} alt="" width={16} height={16} />
          </button>
        </div>
        <div className="modal-body">
          <p className="evidence-export-lede">
            Export <strong>{fileName}</strong> as CSV ({exportCount.toLocaleString()} of{" "}
            {totalRows.toLocaleString()} rows).
          </p>
          <label className="evidence-export-check field">
            <input
              type="checkbox"
              checked={onlyWithEvidence}
              onChange={(event) => setOnlyWithEvidence(event.target.checked)}
            />
            <span>Export only records with evidence</span>
          </label>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={exportCount === 0}
            onClick={() => onConfirm(onlyWithEvidence)}
          >
            Download CSV
          </button>
        </div>
      </div>
    </>
  );
}
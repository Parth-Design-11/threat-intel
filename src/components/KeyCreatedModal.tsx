import { useEffect, useState } from "react";
import { assets } from "../assets";
import type { ManagedApi } from "../data";

type KeyCreatedModalProps = {
  api: ManagedApi;
  onClose: () => void;
};

export function KeyCreatedModal({ api, onClose }: KeyCreatedModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copySecret() {
    try {
      await navigator.clipboard.writeText(api.secret ?? "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(api.keyId);
      setCopiedId(true);
      window.setTimeout(() => setCopiedId(false), 1500);
    } catch {
      setCopiedId(false);
    }
  }

  function downloadEnv() {
    const blob = new Blob(
      [
        `THREAT_INTELLIGENCE_KEY_ID=${api.keyId}\nTHREAT_INTELLIGENCE_SECRET_KEY=${api.secret ?? ""}\n`,
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${api.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "api"}.env`;
    link.click();
    URL.revokeObjectURL(url);
    setConfirmed(true);
  }

  return (
    <>
      <button type="button" className="overlay" aria-label="Close modal" onClick={onClose} />
      <div className="modal" role="dialog" aria-labelledby="key-created-title">
        <div className="modal-header">
          <h2 id="key-created-title" className="modal-title">
            Access key created
          </h2>
          <button type="button" className="close-btn" aria-label="Close" onClick={onClose}>
            <img src={assets.iconClose} alt="" width={16} height={16} />
          </button>
        </div>
        <div className="modal-body is-created">
          <div className="created-summary">
            <div>
              <span className="field-label">API Name</span>
              <p>{api.name}</p>
            </div>
            <div>
              <span className="field-label">Type</span>
              <p>{api.type}</p>
            </div>
            <div>
              <span className="field-label">Environment</span>
              <p>{api.environment}</p>
            </div>
            <div>
              <span className="field-label">Expiry</span>
              <p>{api.expiry}</p>
            </div>
          </div>
          <div className="field">
            <span className="field-label">Key ID</span>
            <div className="secret-row">
              <p>{api.keyId}</p>
              <button type="button" className="copy-btn" aria-label={copiedId ? "Copied" : "Copy"} onClick={copyId}>
                <img src={assets.iconCopy} alt="" width={16} height={16} />
              </button>
            </div>
          </div>
          <div className="field">
            <span className="field-label">Secret Key</span>
            <div className="secret-row">
              <p>{api.secret}</p>
              <button type="button" className="copy-btn" aria-label={copied ? "Copied" : "Copy"} onClick={copySecret}>
                <img src={assets.iconCopy} alt="" width={16} height={16} />
              </button>
            </div>
          </div>
          <div className="info-banner">
            <img src={assets.iconInfo} alt="" width={16} height={16} />
            <p>This is the only time the secret key will be shown. Copy it now and store it securely.</p>
          </div>
          <label className="field-check">
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            <span>I've saved this key securely.</span>
          </label>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={downloadEnv}>
            Download as .env
          </button>
          <button type="button" className="btn-primary" onClick={onClose} disabled={!confirmed && !copied}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}

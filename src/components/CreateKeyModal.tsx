import { useEffect, useState } from "react";
import { resolveExpiryDate } from "../apiManagement";
import { assets } from "../assets";
import { API_TYPES, ENDPOINTS_BY_TYPE, ENVIRONMENTS, EXPIRY_OPTIONS } from "../data";

type CreateKeyModalProps = {
  existingNames: string[];
  onClose: () => void;
  onCreate: (payload: {
    name: string;
    description: string;
    type: (typeof API_TYPES)[number];
    environment: (typeof ENVIRONMENTS)[number];
    expiry: (typeof EXPIRY_OPTIONS)[number];
  }) => void;
};

export function CreateKeyModal({ existingNames, onClose, onCreate }: CreateKeyModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiType, setApiType] = useState<(typeof API_TYPES)[number]>("A-Party Risk Score");
  const [environment, setEnvironment] = useState<(typeof ENVIRONMENTS)[number]>("Production");
  const [expiry, setExpiry] = useState<(typeof EXPIRY_OPTIONS)[number]>("30 days");
  const [openMenu, setOpenMenu] = useState<"type" | "environment" | "expiry" | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const trimmed = name.trim();
  const duplicate = existingNames.some((value) => value.toLowerCase() === trimmed.toLowerCase());
  const valid = trimmed.length >= 3 && trimmed.length <= 50 && !duplicate;
  const endpoints = ENDPOINTS_BY_TYPE[apiType];

  return (
    <>
      <button type="button" className="overlay" aria-label="Close modal" onClick={onClose} />
      <div className="modal" role="dialog" aria-labelledby="create-key-title">
        <div className="modal-header">
          <h2 id="create-key-title" className="modal-title">
            Create New API Key
          </h2>
          <button type="button" className="close-btn" aria-label="Close" onClick={onClose}>
            <img src={assets.iconClose} alt="" width={16} height={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span className="field-label">
              API Key Name <span className="req">*</span>
            </span>
            <input
              className="field-input"
              placeholder="e.g. Fraud Screening - Prod"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {trimmed.length > 0 && trimmed.length < 3 ? (
              <span className="field-help is-danger">Name must be at least 3 characters.</span>
            ) : null}
            {duplicate ? <span className="field-help is-danger">An API with this name already exists.</span> : null}
          </label>

          <div className="field">
            <span className="field-label">API Type</span>
            <div className="select-menu">
              <button
                type="button"
                className="field-select"
                onClick={() => setOpenMenu(openMenu === "type" ? null : "type")}
              >
                {apiType}
                <img src={assets.iconChevron} alt="" width={16} height={16} />
              </button>
              {openMenu === "type" ? (
                <div className="select-list">
                  {API_TYPES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`select-option${option === apiType ? " is-active" : ""}`}
                      onClick={() => {
                        setApiType(option);
                        setOpenMenu(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="field-help">
              Unlocks {endpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`).join(" , ")}.
            </span>
          </div>

          <label className="field">
            <span className="field-label">Description</span>
            <textarea
              className="field-input field-textarea"
              placeholder="What is this integration for?"
              value={description}
              maxLength={200}
              onChange={(event) => setDescription(event.target.value)}
            />
            <span className="field-help">{description.length}/200</span>
          </label>

          <div className="field">
            <span className="field-label">
              Environment <span className="req">*</span>
            </span>
            <div className="select-menu">
              <button
                type="button"
                className="field-select"
                onClick={() => setOpenMenu(openMenu === "environment" ? null : "environment")}
              >
                {environment}
                <img src={assets.iconChevron} alt="" width={16} height={16} />
              </button>
              {openMenu === "environment" ? (
                <div className="select-list">
                  {ENVIRONMENTS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`select-option${option === environment ? " is-active" : ""}`}
                      onClick={() => {
                        setEnvironment(option);
                        setOpenMenu(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="field-help">
              Key IDs will use the `ti_{environment === "Production" ? "prod" : environment === "Staging" ? "stg" : "dev"}` prefix.
            </span>
          </div>

          <div className="field">
            <span className="field-label">
              Expiry <span className="req">*</span>
            </span>
            <div className="select-menu">
              <button
                type="button"
                className="field-select"
                onClick={() => setOpenMenu(openMenu === "expiry" ? null : "expiry")}
              >
                {expiry}
                <img src={assets.iconChevron} alt="" width={16} height={16} />
              </button>
              {openMenu === "expiry" ? (
                <div className="select-list">
                  {EXPIRY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`select-option${option === expiry ? " is-active" : ""}`}
                      onClick={() => {
                        setExpiry(option);
                        setOpenMenu(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="field-help">
              {expiry === "Never"
                ? "Use with care for long-lived integrations."
                : `Expires on ${resolveExpiryDate(expiry, new Date("2026-08-19T00:00:00.000Z"))}.`}
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!valid}
            onClick={() => onCreate({ name: trimmed, description: description.trim(), type: apiType, environment, expiry })}
          >
            Create API Key
          </button>
        </div>
      </div>
    </>
  );
}

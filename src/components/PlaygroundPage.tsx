import { useEffect, useMemo, useState } from "react";
import { assets } from "../assets";
import { ENDPOINTS_BY_TYPE } from "../data";
import type { ManagedApi } from "../data";
import {
  PLAYGROUND_EXAMPLES,
  runPlayground,
  type PlaygroundResult,
  type PlaygroundType,
} from "../playground";
import { ApiTabs, type ApiTab } from "./ApiTabs";

type PlaygroundPageProps = {
  keys: ManagedApi[];
  onCreate: () => void;
  onChangeTab: (tab: ApiTab) => void;
};

function mapType(type: ManagedApi["type"]): PlaygroundType {
  if (type === "A-Party Risk Score") return "risk-score";
  if (type === "B-Party Vulnerability") return "b-party";
  if (type === "CTA Check") return "cta";
  return "pattern";
}

function mapEndpoint(path: string): PlaygroundType {
  if (path === "/v1/risk/a-party") return "risk-score";
  if (path === "/v1/risk/b-party") return "b-party";
  if (path === "/v1/check/cta") return "cta";
  return "pattern";
}

export function PlaygroundPage({ keys, onCreate, onChangeTab }: PlaygroundPageProps) {
  const enabledKeys = keys.filter((key) => key.status === "Active");
  const initialApi = enabledKeys[0] ?? keys[0] ?? null;
  const [selectedId, setSelectedId] = useState(initialApi?.id ?? "");
  const [type, setType] = useState<PlaygroundType>(initialApi ? mapType(initialApi.type) : "risk-score");
  const [request, setRequest] = useState(PLAYGROUND_EXAMPLES[initialApi ? mapType(initialApi.type) : "risk-score"]);
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedRequest, setCopiedRequest] = useState(false);
  const selectedApi = keys.find((key) => key.id === selectedId) ?? initialApi;
  const candidateEndpoints = selectedApi ? ENDPOINTS_BY_TYPE[selectedApi.type] : [];
  const [selectedEndpoint, setSelectedEndpoint] = useState(candidateEndpoints[0]?.path ?? "");

  useEffect(() => {
    if (!selectedApi) return;
    const nextType = mapType(selectedApi.type === "All APIs" ? "A-Party Risk Score" : selectedApi.type);
    setType(nextType);
    setSelectedEndpoint(ENDPOINTS_BY_TYPE[selectedApi.type][0]?.path ?? "");
    setRequest(PLAYGROUND_EXAMPLES[nextType]);
    setResult(null);
  }, [selectedApi?.id]);

  const prettyResponse = useMemo(
    () => (result ? JSON.stringify(result.body, null, 2) : ""),
    [result],
  );

  function run() {
    setCopied(false);
    setResult(runPlayground(type, request));
  }

  async function copy() {
    if (!prettyResponse) return;
    try {
      await navigator.clipboard.writeText(prettyResponse);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  async function copyRequestBody() {
    try {
      await navigator.clipboard.writeText(request);
      setCopiedRequest(true);
      window.setTimeout(() => setCopiedRequest(false), 1500);
    } catch {
      setCopiedRequest(false);
    }
  }

  if (!selectedApi) {
    return (
      <div className="main-inner">
        <div className="page-header">
          <h1 className="page-title">API Management</h1>
          <button type="button" className="btn-access" onClick={onCreate}>
            <span className="icon" style={{ width: 20, height: 20 }}>
              <img src={assets.iconAdd} alt="" width={20} height={20} />
            </span>
            Create API
          </button>
        </div>
        <ApiTabs active="playground" onChange={onChangeTab} />
        <section className="playground empty-state-card">
          <p className="logs-title">Create an API to start testing.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="main-inner">
      <div className="page-header">
        <h1 className="page-title">API Management</h1>
        <button type="button" className="btn-access" onClick={onCreate}>
          <span className="icon" style={{ width: 20, height: 20 }}>
            <img src={assets.iconAdd} alt="" width={20} height={20} />
          </span>
          Create API
        </button>
      </div>

      <ApiTabs active="playground" onChange={onChangeTab} />

      <section className="playground">
        <div className="playground-toolbar">
          <label className="field playground-type">
            <span className="field-label">API</span>
            <select
              className="field-input"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {keys.map((item) => (
                <option key={item.id} value={item.id}>
                  {`${item.name} · ${item.type}${item.status === "Active" ? "" : ` · ${item.status}`}`}
                </option>
              ))}
            </select>
          </label>
          {selectedApi.type === "All APIs" ? (
            <label className="field playground-type">
              <span className="field-label">Endpoint</span>
              <select
                className="field-input"
                value={selectedEndpoint}
                onChange={(event) => {
                  const next = event.target.value;
                  setSelectedEndpoint(next);
                  const nextType = mapEndpoint(next);
                  setType(nextType);
                  setRequest(PLAYGROUND_EXAMPLES[nextType]);
                  setResult(null);
                }}
              >
                {candidateEndpoints.map((item) => (
                  <option key={item.path} value={item.path}>
                    {`${item.method} ${item.path}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="playground-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setRequest(PLAYGROUND_EXAMPLES[type]);
                setResult(null);
              }}
            >
              Load example
            </button>
            <button type="button" className="btn-primary" onClick={run}>
              Run
            </button>
          </div>
        </div>

        <div className="playground-grid">
          <article className="playground-panel">
            <div className="playground-panel-header">
              <p className="logs-title">Request JSON</p>
              <button type="button" className="copy-btn" aria-label={copiedRequest ? "Copied" : "Copy request"} onClick={copyRequestBody}>
                <img src={assets.iconCopy} alt="" width={16} height={16} />
              </button>
            </div>
            <div className="request-preview">
              <p>{`${candidateEndpoints[0]?.method ?? "POST"} https://api.wisely.ai${selectedEndpoint || candidateEndpoints[0]?.path}`}</p>
              <p>{`Authorization: Bearer ${selectedApi.maskedKeyId}`}</p>
              <p>Content-Type: application/json</p>
            </div>
            <textarea
              className="playground-editor"
              spellCheck={false}
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              aria-label="Request JSON"
            />
          </article>

          <article className="playground-panel">
            <div className="playground-panel-header">
              <p className="logs-title">Response JSON</p>
              <div className="playground-response-meta">
                {result ? (
                  <span className={`badge ${result.status < 400 ? "is-status-ok" : "is-status-err"}`}>
                    {result.status}
                  </span>
                ) : null}
                {result ? <span className="playground-meta-text">142 ms · req_8f2k9m4b</span> : null}
                <button
                  type="button"
                  className="copy-btn"
                  aria-label={copied ? "Copied" : "Copy response"}
                  onClick={copy}
                  disabled={!result}
                >
                  <img src={assets.iconCopy} alt="" width={16} height={16} />
                </button>
              </div>
            </div>
            <pre className={`playground-output${result && result.status >= 400 ? " is-error" : ""}`}>
              {prettyResponse || "Run a request to see the response."}
            </pre>
          </article>
        </div>
      </section>
    </div>
  );
}

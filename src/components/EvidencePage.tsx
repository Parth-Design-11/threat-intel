import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { assets } from "../assets";
import {
  filterEvidenceCdrLogs,
  rangeForPreset,
  resolveEvidenceCdrLogs,
  resolveEvidenceMetrics,
  type EvidenceCdrRow,
  type EvidenceDatePreset,
  type EvidenceIdentifiedAs,
} from "../evidenceData";
import { maskIdentifier } from "../exploreData";
import { addExploreHistory, getExploreHistory, type ExploreHistoryEntry } from "../exploreHistory";
import { formatDateRange, InsightsDateRange, type DateRange } from "./InsightsDateRange";

const DATE_PRESETS: { id: EvidenceDatePreset; label: string }[] = [
  { id: "7", label: "Last 7 days" },
  { id: "30", label: "Last 30 days" },
  { id: "60", label: "Last 60 days" },
  { id: "custom", label: "Custom" },
];

const STATUS_OPTIONS: { id: "all" | EvidenceIdentifiedAs; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "Clean", label: "Clean" },
  { id: "Spam", label: "Spam" },
  { id: "Scam", label: "Scam" },
];

function formatHistoryTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 4.5V9L12 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function EvidencePage() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ExploreHistoryEntry[]>(() => getExploreHistory("evidence"));
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!historyOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!historyRef.current?.contains(event.target as Node)) {
        setHistoryOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setHistoryOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [historyOpen]);

  function runSearch(nextQuery: string) {
    const trimmed = nextQuery.trim();
    if (trimmed === "") {
      setError("Enter a phone number to search.");
      setSubmittedQuery(null);
      return;
    }
    setQuery(trimmed);
    setError("");
    addExploreHistory("evidence", trimmed);
    setHistory(getExploreHistory("evidence"));
    setHistoryOpen(false);
    setSubmittedQuery(trimmed);
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    runSearch(query);
  }

  if (submittedQuery) {
    const metrics = resolveEvidenceMetrics(submittedQuery);
    const rows = resolveEvidenceCdrLogs(submittedQuery, 100);
    return (
      <EvidenceResults
        query={submittedQuery}
        metrics={metrics}
        rows={rows}
        onBack={() => setSubmittedQuery(null)}
      />
    );
  }

  return (
    <div className="main-inner is-evidence">
      <section className="explore-landing evidence-landing">
        <div className="explore-heading">
          <h1 className="page-title">Evidence</h1>
          <p className="explore-lede">Look up inbound message evidence against a phone number.</p>
        </div>

        <form className="evidence-search" onSubmit={submit}>
          <div className="evidence-search-shell">
            <input
              className="evidence-search-input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (error) setError("");
              }}
              placeholder="Enter phone number"
              aria-label="Phone number"
              aria-invalid={Boolean(error)}
            />
            <button type="submit" className="evidence-search-btn">
              Search
            </button>
          </div>

          <div className="evidence-search-history" ref={historyRef}>
            <button
              type="button"
              className="evidence-search-history-btn"
              aria-label="Recent searches"
              aria-expanded={historyOpen}
              aria-haspopup="listbox"
              onClick={() => setHistoryOpen((open) => !open)}
            >
              <HistoryIcon />
            </button>
            {historyOpen ? (
              <div className="explore-history-menu" role="listbox" aria-label="Recent searches">
                {history.length === 0 ? (
                  <p className="explore-history-empty">No recent searches</p>
                ) : (
                  history.map((entry) => (
                    <button
                      key={`${entry.query}-${entry.searchedAt}`}
                      type="button"
                      role="option"
                      className="explore-history-item"
                      onClick={() => runSearch(entry.query)}
                    >
                      <span className="explore-history-query" title={entry.query}>
                        {entry.query}
                      </span>
                      <span className="explore-history-time">
                        {formatHistoryTime(entry.searchedAt)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </form>

        {error ? <p className="explore-error">{error}</p> : null}
      </section>
    </div>
  );
}

type EvidenceResultsProps = {
  query: string;
  metrics: ReturnType<typeof resolveEvidenceMetrics>;
  rows: EvidenceCdrRow[];
  onBack: () => void;
};

function EvidenceResults({ query, metrics, rows, onBack }: EvidenceResultsProps) {
  const [datePreset, setDatePreset] = useState<EvidenceDatePreset>("30");
  const [range, setRange] = useState<DateRange>(() => rangeForPreset("30"));
  const [status, setStatus] = useState<"all" | EvidenceIdentifiedAs>("all");
  const [senderQuery, setSenderQuery] = useState("");

  const filteredRows = useMemo(
    () =>
      filterEvidenceCdrLogs(rows, {
        range,
        status,
        senderQuery,
      }),
    [rows, range, status, senderQuery],
  );

  function selectPreset(preset: EvidenceDatePreset) {
    setDatePreset(preset);
    if (preset !== "custom") {
      setRange(rangeForPreset(preset));
    }
  }

  return (
    <div className="main-inner is-evidence is-evidence-results">
      <header className="result-header">
        <button type="button" className="result-back" onClick={onBack} aria-label="Back to search">
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title">{maskIdentifier(query)}</h1>
          <p className="result-meta">Evidence · {formatDateRange(range)}</p>
        </div>
      </header>

      <section className="metrics insights-metrics evidence-metrics" aria-label="Evidence summary">
        <article className="metric-card">
          <p className="metric-label">Total Messages received</p>
          <div className="metric-row">
            <p className="metric-value">{metrics.totalMessages}</p>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Spam messages identified</p>
          <div className="metric-row">
            <p className="metric-value">{metrics.spamMessages}</p>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Scam messages identified</p>
          <div className="metric-row">
            <p className="metric-value">{metrics.scamMessages}</p>
          </div>
        </article>
      </section>

      <section className="table-card insights-table-card evidence-cdr-card" aria-label="CDR logs">
        <div className="evidence-cdr-head">
          <div>
            <h2 className="insights-card-title is-table">Latest 100 CDR logs</h2>
            <p className="evidence-cdr-lede">
              Showing {filteredRows.length} of {rows.length} inbound messages for this number.
            </p>
          </div>
        </div>

        <div className="evidence-cdr-filters" aria-label="CDR filters">
          <label className="evidence-filter-field">
            <span className="evidence-filter-label">Date range</span>
            <select
              className="evidence-filter-select"
              value={datePreset}
              onChange={(event) => selectPreset(event.target.value as EvidenceDatePreset)}
              aria-label="Date range"
            >
              {DATE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>

          {datePreset === "custom" ? (
            <InsightsDateRange
              value={range}
              onChange={(next) => {
                setDatePreset("custom");
                setRange(next);
              }}
            />
          ) : null}

          <label className="evidence-filter-field">
            <span className="evidence-filter-label">Status</span>
            <select
              className="evidence-filter-select"
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | EvidenceIdentifiedAs)}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="evidence-filter-field evidence-filter-sender">
            <span className="evidence-filter-label">Sender</span>
            <input
              className="evidence-filter-input"
              value={senderQuery}
              onChange={(event) => setSenderQuery(event.target.value)}
              placeholder="Search sender"
              aria-label="Search against a specific sender"
            />
          </label>
        </div>

        <div className="table-wrap evidence-cdr-wrap">
          <div className="thead evidence-cdr-row is-head">
            <div className="th">Reference ID</div>
            <div className="th">Sender</div>
            <div className="th">Time Stamp</div>
            <div className="th">Identified As</div>
          </div>
          {filteredRows.length === 0 ? (
            <p className="evidence-cdr-empty">No CDR logs match these filters.</p>
          ) : (
            filteredRows.map((row) => (
              <div key={row.id} className="trow evidence-cdr-row">
                <div className="td evidence-cdr-ref">{row.referenceId}</div>
                <div className="td">{row.sender}</div>
                <div className="td">{row.timestamp}</div>
                <div className="td">
                  <span className={`evidence-cdr-tag is-${row.identifiedAs.toLowerCase()}`}>
                    {row.identifiedAs}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

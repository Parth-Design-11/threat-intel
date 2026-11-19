import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { assets } from "../assets";
import {
  filterEvidenceCdrLogs,
  pairHasEvidence,
  rangeForPreset,
  resolveEvidenceBatch,
  resolveEvidenceCdrLogs,
  resolveEvidenceMetrics,
  resolveEvidencePairCdrLogs,
  resolveEvidencePairMetrics,
  SAMPLE_EVIDENCE_PAIRS,
  type EvidenceBatchRow,
  type EvidenceCdrRow,
  type EvidenceDatePreset,
  type EvidenceIdentifiedAs,
  type EvidencePartyPair,
} from "../evidenceData";
import {
  B_PARTY_PROFILE,
  B_PARTY_PROFILE_NO_EVIDENCE,
  maskIdentifier,
  resolveBPartyResultState,
} from "../exploreData";
import { addExploreHistory, getExploreHistory, type ExploreHistoryEntry } from "../exploreHistory";
import { BPartyExposureSummary } from "./BPartyExposureSummary";
import { EvidenceCdrCurtain, type EvidenceCdrReviewDecision } from "./EvidenceCdrCurtain";
import { formatDateRange, InsightsDateRange, type DateRange } from "./InsightsDateRange";

type EvidenceLandingTab = "single" | "upload";

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

const LANDING_TABS: { id: EvidenceLandingTab; label: string }[] = [
  { id: "single", label: "Single phone number" },
  { id: "upload", label: "Upload" },
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
  const [landingTab, setLandingTab] = useState<EvidenceLandingTab>("single");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [selectedPair, setSelectedPair] = useState<EvidencePartyPair | null>(null);
  const [batchRows, setBatchRows] = useState<EvidenceBatchRow[] | null>(null);
  const [batchFileName, setBatchFileName] = useState("");
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
    setBatchRows(null);
    setSelectedPair(null);
    setSubmittedQuery(trimmed);
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    runSearch(query);
  }

  function continueWithSampleFile() {
    setError("");
    setBatchFileName("sample-a-b-party.csv");
    setSubmittedQuery(null);
    setSelectedPair(null);
    setBatchRows(resolveEvidenceBatch(SAMPLE_EVIDENCE_PAIRS));
  }

  if (selectedPair) {
    const metrics = resolveEvidencePairMetrics(selectedPair.aParty, selectedPair.bParty);
    const rows = resolveEvidencePairCdrLogs(selectedPair.aParty, selectedPair.bParty);
    return (
      <EvidenceResults
        query={selectedPair.bParty}
        aParty={selectedPair.aParty}
        bParty={selectedPair.bParty}
        metrics={metrics}
        rows={rows}
        allowReview
        onBack={() => setSelectedPair(null)}
        backLabel="Back to upload results"
      />
    );
  }

  if (submittedQuery) {
    const metrics = resolveEvidenceMetrics(submittedQuery);
    const rows = resolveEvidenceCdrLogs(submittedQuery, 100);
    return (
      <EvidenceResults
        query={submittedQuery}
        metrics={metrics}
        rows={rows}
        onBack={() => {
          setSubmittedQuery(null);
          setLandingTab("single");
        }}
        backLabel="Back to search"
      />
    );
  }

  if (batchRows) {
    return (
      <EvidenceBatchResults
        fileName={batchFileName}
        rows={batchRows}
        onBack={() => {
          setBatchRows(null);
          setLandingTab("upload");
        }}
        onOpenPair={(pair) => {
          if (!pairHasEvidence(pair.aParty, pair.bParty)) return;
          setSelectedPair(pair);
        }}
      />
    );
  }

  return (
    <div className="main-inner is-evidence">
      <section className="explore-landing evidence-landing">
        <div className="explore-heading">
          <h1 className="page-title">Evidence</h1>
          <p className="explore-lede">
            {landingTab === "single"
              ? "Look up inbound message evidence against a phone number."
              : "Load a sample A-party / B-party file and continue to combination results."}
          </p>
        </div>

        <div className="tabs evidence-landing-tabs" role="tablist" aria-label="Evidence lookup mode">
          {LANDING_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={landingTab === tab.id}
              className={`tab${landingTab === tab.id ? " is-active" : ""}`}
              onClick={() => {
                setLandingTab(tab.id);
                setError("");
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {landingTab === "single" ? (
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
        ) : (
          <div className="evidence-upload">
            <button type="button" className="evidence-upload-drop" onClick={continueWithSampleFile}>
              <strong>Upload sample file and continue</strong>
              <span>Loads demo A-party → B-party combinations and opens results.</span>
            </button>
            <p className="evidence-upload-hint">
              Sample includes sender (A-party) and receiver (B-party) pairs for review.
            </p>
          </div>
        )}

        {error ? <p className="explore-error">{error}</p> : null}
      </section>
    </div>
  );
}

type EvidenceBatchResultsProps = {
  fileName: string;
  rows: EvidenceBatchRow[];
  onBack: () => void;
  onOpenPair: (pair: EvidencePartyPair) => void;
};

function EvidenceBatchResults({ fileName, rows, onBack, onOpenPair }: EvidenceBatchResultsProps) {
  const withEvidence = rows.filter((row) => row.status === "has-evidence");
  const withoutEvidence = rows.length - withEvidence.length;

  return (
    <div className="main-inner is-evidence is-evidence-results">
      <header className="result-header">
        <button type="button" className="result-back" onClick={onBack} aria-label="Back to upload">
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title">Upload results</h1>
          <p className="result-meta">
            {fileName || "A/B party list"} · {rows.length.toLocaleString()} combinations scanned
          </p>
        </div>
      </header>

      <section className="metrics insights-metrics evidence-metrics evidence-batch-metrics" aria-label="Batch evidence summary">
        <article className="metric-card">
          <p className="metric-label">Combinations uploaded</p>
          <div className="metric-row">
            <p className="metric-value">{rows.length.toLocaleString()}</p>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Evidence available</p>
          <div className="metric-row">
            <p className="metric-value">{withEvidence.length.toLocaleString()}</p>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">No evidence</p>
          <div className="metric-row">
            <p className="metric-value">{withoutEvidence.toLocaleString()}</p>
          </div>
        </article>
      </section>

      <section className="table-card insights-table-card evidence-cdr-card" aria-label="Uploaded A/B party pairs">
        <div className="evidence-cdr-head">
          <div>
            <h2 className="insights-card-title is-table">Combination coverage</h2>
            <p className="evidence-cdr-lede">
              Evidence found for {withEvidence.length.toLocaleString()} of {rows.length.toLocaleString()}{" "}
              A-party → B-party combinations. Open a pair with evidence to review its CDR logs.
            </p>
          </div>
        </div>

        <div className="table-wrap evidence-cdr-wrap">
          <div className="thead evidence-batch-row is-head">
            <div className="th">A-party</div>
            <div className="th">B-party</div>
            <div className="th">Status</div>
            <div className="th">Messages</div>
            <div className="th">Scam</div>
            <div className="th is-expand" aria-hidden="true" />
          </div>
          {rows.map((row) => {
            const canOpen = row.status === "has-evidence";
            return (
              <button
                key={row.id}
                type="button"
                className={`trow evidence-batch-row is-toggle${canOpen ? "" : " is-disabled"}`}
                disabled={!canOpen}
                onClick={() => onOpenPair({ aParty: row.aParty, bParty: row.bParty })}
              >
                <div className="td evidence-cdr-ref" title={row.aParty}>
                  {row.aDisplay}
                </div>
                <div className="td evidence-cdr-ref" title={row.bParty}>
                  {row.bDisplay}
                </div>
                <div className="td">
                  <span className={`evidence-cdr-tag is-${canOpen ? "clean" : "spam"}`}>
                    {canOpen ? "Evidence available" : "No evidence"}
                  </span>
                </div>
                <div className="td">{row.messageCount}</div>
                <div className="td">{row.scamCount}</div>
                <div className="td is-expand" aria-hidden="true">
                  <span className="evidence-cdr-chevron">{canOpen ? "›" : ""}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type EvidenceResultsProps = {
  query: string;
  metrics: ReturnType<typeof resolveEvidenceMetrics>;
  rows: EvidenceCdrRow[];
  onBack: () => void;
  backLabel?: string;
  allowReview?: boolean;
  aParty?: string;
  bParty?: string;
};

function EvidenceResults({
  query,
  metrics,
  rows,
  onBack,
  backLabel = "Back to search",
  allowReview = false,
  aParty,
  bParty,
}: EvidenceResultsProps) {
  const [datePreset, setDatePreset] = useState<EvidenceDatePreset>("30");
  const [range, setRange] = useState<DateRange>(() => rangeForPreset("30"));
  const [status, setStatus] = useState<"all" | EvidenceIdentifiedAs>("all");
  const [senderQuery, setSenderQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState<EvidenceCdrRow | null>(null);
  const [reviewById, setReviewById] = useState<Record<string, EvidenceCdrReviewDecision>>({});
  const vulnerabilityState = resolveBPartyResultState(query);
  const exposureProfile =
    vulnerabilityState === "no-evidence" || vulnerabilityState === "zero"
      ? B_PARTY_PROFILE_NO_EVIDENCE
      : B_PARTY_PROFILE;

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
        <button type="button" className="result-back" onClick={onBack} aria-label={backLabel}>
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title">
            {aParty && bParty
              ? `${maskIdentifier(aParty)} → ${maskIdentifier(bParty)}`
              : maskIdentifier(query)}
          </h1>
          <p className="result-meta">
            {aParty && bParty ? "A-party → B-party evidence" : "Evidence"} · {formatDateRange(range)}
          </p>
        </div>
      </header>

      <section className="metrics insights-metrics evidence-metrics" aria-label="Evidence summary">
        <article className="metric-card">
          <p className="metric-label">
            {aParty && bParty ? "Messages for this pair" : "Total Messages received"}
          </p>
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

      {!aParty && vulnerabilityState !== "zero" ? (
        <BPartyExposureSummary profile={exposureProfile} className="evidence-exposure" />
      ) : null}

      <section className="table-card insights-table-card evidence-cdr-card" aria-label="CDR logs">
        <div className="evidence-cdr-head">
          <div>
            <h2 className="insights-card-title is-table">
              {aParty && bParty ? "CDR logs for this combination" : "Latest 100 CDR logs"}
            </h2>
            <p className="evidence-cdr-lede">
              {aParty && bParty
                ? `Showing ${filteredRows.length} of ${rows.length} messages from this A-party to this B-party.`
                : `Showing ${filteredRows.length} of ${rows.length} inbound messages for this number.`}
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
            <div className="th is-expand" aria-hidden="true" />
          </div>
          {filteredRows.length === 0 ? (
            <p className="evidence-cdr-empty">No CDR logs match these filters.</p>
          ) : (
            filteredRows.map((row) => {
              const selected = selectedRow?.id === row.id;
              const decision = reviewById[row.id];
              return (
                <button
                  key={row.id}
                  type="button"
                  className={`trow evidence-cdr-row is-toggle${selected ? " is-selected" : ""}`}
                  aria-pressed={selected}
                  onClick={() => setSelectedRow(row)}
                >
                  <div className="td evidence-cdr-ref">{row.referenceId}</div>
                  <div className="td">{row.sender}</div>
                  <div className="td">{row.timestamp}</div>
                  <div className="td">
                    <span className={`evidence-cdr-tag is-${row.identifiedAs.toLowerCase()}`}>
                      {row.identifiedAs}
                    </span>
                    {decision ? (
                      <span className={`evidence-cdr-review-chip is-${decision}`}>
                        {decision === "approved" ? "Approved" : "Rejected"}
                      </span>
                    ) : null}
                  </div>
                  <div className="td is-expand" aria-hidden="true">
                    <span className="evidence-cdr-chevron">›</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {selectedRow ? (
        <EvidenceCdrCurtain
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          showReviewActions={allowReview}
          reviewDecision={reviewById[selectedRow.id] ?? null}
          onReview={(decision) => {
            setReviewById((current) => ({ ...current, [selectedRow.id]: decision }));
          }}
        />
      ) : null}
    </div>
  );
}

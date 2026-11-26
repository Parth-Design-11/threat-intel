import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { downloadCombinationBatchCsv, downloadNumberBatchCsv } from "../evidenceBatchExport";
import { assets } from "../assets";
import {
  filterEvidenceCdrLogs,
  numberHasEvidence,
  pairHasEvidence,
  rangeForPreset,
  resolveEvidenceBatch,
  resolveEvidenceCdrLogs,
  resolveEvidenceMetrics,
  resolveEvidenceNumberBatch,
  resolveEvidencePairCdrLogs,
  resolveEvidencePairMetrics,
  SAMPLE_EVIDENCE_NUMBERS,
  SAMPLE_EVIDENCE_PAIRS,
  type EvidenceBatchRow,
  type EvidenceCdrRow,
  type EvidenceDatePreset,
  type EvidenceIdentifiedAs,
  type EvidenceNumberBatchRow,
  type EvidencePartyPair,
} from "../evidenceData";
import {
  B_PARTY_PROFILE,
  B_PARTY_PROFILE_NO_EVIDENCE,
  maskIdentifier,
  resolveBPartyResultState,
} from "../exploreData";
import { addExploreHistory, getExploreHistory, type ExploreHistoryEntry } from "../exploreHistory";
import { useDevOverride } from "../devtools";
import { BPartyExposureSummary } from "./BPartyExposureSummary";
import { BPartyProfileResult } from "./BPartyProfileResult";
import { EvidenceCdrCurtain, type EvidenceCdrReviewDecision } from "./EvidenceCdrCurtain";
import { EvidenceBatchExportModal } from "./EvidenceBatchExportModal";
import { EvidenceFileProcessingLoader } from "./EvidenceFileProcessingLoader";
import { EvidenceUploadsSection } from "./EvidenceUploadsSection";
import { addEvidenceUpload, type EvidenceUploadRecord } from "../evidenceUploads";
import { formatDateRange, InsightsDateRange, type DateRange } from "./InsightsDateRange";

type EvidenceLandingTab = "number" | "multiple" | "party-pairs";
type EvidenceSearchPerspective = "receiver" | "sender";
type UploadProcessingKind = "multiple" | "combination";

const DATE_PRESETS: { id: EvidenceDatePreset; label: string }[] = [
  { id: "7", label: "Last 7 days" },
  { id: "30", label: "Last 30 days" },
  { id: "60", label: "Last 60 days" },
  { id: "custom", label: "Custom" },
];

const STATUS_OPTIONS: { id: "all" | Exclude<EvidenceIdentifiedAs, "Clean">; label: string }[] = [
  { id: "all", label: "Spam & scam" },
  { id: "Spam", label: "Spam only" },
  { id: "Scam", label: "Scam only" },
];

const LANDING_TABS: { id: EvidenceLandingTab; label: string }[] = [
  { id: "number", label: "Search evidence by number" },
  { id: "multiple", label: "Multiple numbers" },
  { id: "party-pairs", label: "A Party, B Party Combination" },
];

const LANDING_LEDE: Record<EvidenceLandingTab, string> = {
  number: "Look up inbound message evidence and receiver (B-party) vulnerability for one number.",
  multiple: "Upload a list of receiver numbers and scan which have evidence on file.",
  "party-pairs": "Upload a file of A-party and B-party number pairs for bulk combination review.",
};

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
  const [landingTab, setLandingTab] = useState<EvidenceLandingTab>("number");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [submittedPerspective, setSubmittedPerspective] = useState<EvidenceSearchPerspective>("receiver");
  const [selectedPair, setSelectedPair] = useState<EvidencePartyPair | null>(null);
  const [batchRows, setBatchRows] = useState<EvidenceBatchRow[] | null>(null);
  const [numberBatchRows, setNumberBatchRows] = useState<EvidenceNumberBatchRow[] | null>(null);
  const [batchFileName, setBatchFileName] = useState("");
  const [uploadProcessing, setUploadProcessing] = useState<{
    kind: UploadProcessingKind;
    fileName: string;
  } | null>(null);
  const [uploadsRefreshKey, setUploadsRefreshKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ExploreHistoryEntry[]>(() => getExploreHistory("evidence"));
  const historyRef = useRef<HTMLDivElement>(null);
  const bPartyDevState = useDevOverride(
    "evidence.bParty",
    submittedQuery ? resolveBPartyResultState(submittedQuery) : "full",
  );

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
    setNumberBatchRows(null);
    setSelectedPair(null);
    setSubmittedPerspective("receiver");
    setSubmittedQuery(trimmed);
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    runSearch(query);
  }

  function continueWithCombinationSample() {
    const rows = resolveEvidenceBatch(SAMPLE_EVIDENCE_PAIRS);
    const fileName = "sample-a-b-party.csv";
    setError("");
    setBatchFileName(fileName);
    setSubmittedQuery(null);
    setSelectedPair(null);
    setNumberBatchRows(null);
    setBatchRows(rows);
    addEvidenceUpload({ fileName, kind: "combination", combinationRows: rows });
    setUploadsRefreshKey((key) => key + 1);
  }

  function continueWithNumberSample() {
    const rows = resolveEvidenceNumberBatch(SAMPLE_EVIDENCE_NUMBERS);
    const fileName = "sample-b-party-numbers.csv";
    setError("");
    setBatchFileName(fileName);
    setSubmittedQuery(null);
    setSelectedPair(null);
    setBatchRows(null);
    setNumberBatchRows(rows);
    addEvidenceUpload({ fileName, kind: "multiple", numberRows: rows });
    setUploadsRefreshKey((key) => key + 1);
  }

  function beginUploadProcessing(kind: UploadProcessingKind) {
    setError("");
    setUploadProcessing({
      kind,
      fileName: kind === "multiple" ? "sample-b-party-numbers.csv" : "sample-a-b-party.csv",
    });
  }

  function finishUploadProcessing() {
    if (!uploadProcessing) return;
    if (uploadProcessing.kind === "multiple") {
      continueWithNumberSample();
    } else {
      continueWithCombinationSample();
    }
    setUploadProcessing(null);
  }

  function openStoredUpload(record: EvidenceUploadRecord) {
    setBatchFileName(record.fileName);
    setSubmittedQuery(null);
    setSelectedPair(null);
    if (record.kind === "multiple" && record.numberRows) {
      setBatchRows(null);
      setNumberBatchRows(record.numberRows);
      return;
    }
    if (record.kind === "combination" && record.combinationRows) {
      setNumberBatchRows(null);
      setBatchRows(record.combinationRows);
    }
  }

  function openNumberFromBatch(number: string) {
    if (!numberHasEvidence(number)) return;
    setSubmittedPerspective("receiver");
    setSubmittedQuery(number);
    setNumberBatchRows(null);
    setBatchRows(null);
  }

  if (uploadProcessing) {
    return (
      <EvidenceFileProcessingLoader
        fileName={uploadProcessing.fileName}
        onDone={finishUploadProcessing}
        onBack={() => setUploadProcessing(null)}
      />
    );
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
    const isReceiverLookup = submittedPerspective === "receiver";
    if (isReceiverLookup && bPartyDevState === "zero") {
      return (
        <BPartyProfileResult
          query={submittedQuery}
          onBack={() => {
            setSubmittedQuery(null);
            setLandingTab("number");
          }}
        />
      );
    }

    const metrics = resolveEvidenceMetrics(submittedQuery);
    const rows = resolveEvidenceCdrLogs(submittedQuery, 100);
    return (
      <EvidenceResults
        query={submittedQuery}
        metrics={metrics}
        rows={rows}
        perspective={submittedPerspective}
        showBPartyVulnerability={isReceiverLookup}
        onBack={() => {
          setSubmittedQuery(null);
          setLandingTab("number");
        }}
        backLabel="Back to search"
      />
    );
  }

  if (numberBatchRows) {
    return (
      <EvidenceNumberBatchResults
        fileName={batchFileName}
        rows={numberBatchRows}
        onBack={() => {
          setNumberBatchRows(null);
          setLandingTab("multiple");
        }}
        onOpenNumber={openNumberFromBatch}
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
          setLandingTab("party-pairs");
        }}
        onOpenPair={(pair) => {
          if (!pairHasEvidence(pair.aParty, pair.bParty)) return;
          setSelectedPair(pair);
        }}
      />
    );
  }

  const showUploadHistory = landingTab === "multiple" || landingTab === "party-pairs";
  const uploadHistoryKind: "multiple" | "combination" =
    landingTab === "multiple" ? "multiple" : "combination";

  return (
    <div className="main-inner is-evidence">
      <section
        className={`explore-landing evidence-landing${showUploadHistory ? " is-with-uploads" : ""}`}
      >
        <div className="explore-heading">
          <h1 className="page-title">Evidence</h1>
          <p className="explore-lede">{LANDING_LEDE[landingTab]}</p>
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

        {landingTab === "number" ? (
          <form className="evidence-search" onSubmit={submit}>
            <div className="evidence-search-shell">
              <input
                className="evidence-search-input"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter B-party phone number"
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
        ) : showUploadHistory ? (
          <>
            <div className="evidence-upload">
              <button
                type="button"
                className="evidence-upload-drop"
                onClick={() => beginUploadProcessing(uploadHistoryKind)}
              >
                <strong>Upload sample file and continue</strong>
                <span>
                  {landingTab === "multiple"
                    ? "Loads demo receiver numbers and opens batch results."
                    : "Loads demo A-party → B-party combinations and opens results."}
                </span>
              </button>
              <p className="evidence-upload-hint">
                {landingTab === "multiple"
                  ? "Sample includes one B-party number per row for bulk evidence lookup."
                  : "Sample includes sender (A-party) and receiver (B-party) pairs for review."}
              </p>
            </div>
            <EvidenceUploadsSection
              embedded
              kind={uploadHistoryKind}
              refreshKey={uploadsRefreshKey}
              onOpenUpload={(record) => openStoredUpload(record)}
            />
          </>
        ) : null}

        {error ? <p className="explore-error">{error}</p> : null}
      </section>
    </div>
  );
}

type EvidenceNumberBatchResultsProps = {
  fileName: string;
  rows: EvidenceNumberBatchRow[];
  onBack: () => void;
  onOpenNumber: (number: string) => void;
};

function EvidenceNumberBatchResults({
  fileName,
  rows,
  onBack,
  onOpenNumber,
}: EvidenceNumberBatchResultsProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const withEvidence = rows.filter((row) => row.status === "has-evidence");
  const withoutEvidence = rows.length - withEvidence.length;

  return (
    <div className="main-inner is-evidence is-evidence-results">
      <header className="result-header">
        <button type="button" className="result-back" onClick={onBack} aria-label="Back to upload">
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title">Multiple numbers</h1>
          <p className="result-meta">
            {fileName || "Number list"} · {rows.length.toLocaleString()} numbers scanned
          </p>
        </div>
      </header>

      <section
        className="metrics insights-metrics evidence-metrics evidence-batch-metrics"
        aria-label="Batch evidence summary"
      >
        <article className="metric-card">
          <p className="metric-label">Numbers uploaded</p>
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

      <section className="table-card insights-table-card evidence-cdr-card" aria-label="Uploaded numbers">
        <div className="evidence-cdr-head evidence-cdr-head-row">
          <div>
            <h2 className="insights-card-title is-table">Number coverage</h2>
            <p className="evidence-cdr-lede">
              Evidence found for {withEvidence.length.toLocaleString()} of {rows.length.toLocaleString()}{" "}
              receiver numbers. Open a number with evidence to review CDR logs and vulnerability.
            </p>
          </div>
          <button type="button" className="evidence-batch-download" onClick={() => setExportOpen(true)}>
            Download
          </button>
        </div>

        <div className="table-wrap evidence-cdr-wrap">
          <div className="thead evidence-batch-row is-head evidence-number-batch-row">
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
                className={`trow evidence-batch-row evidence-number-batch-row is-toggle${canOpen ? "" : " is-disabled"}`}
                disabled={!canOpen}
                onClick={() => onOpenNumber(row.number)}
              >
                <div className="td evidence-cdr-ref" title={row.number}>
                  {row.display}
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

      {exportOpen ? (
        <EvidenceBatchExportModal
          fileName={fileName || "Number list"}
          totalRows={rows.length}
          evidenceRows={withEvidence.length}
          onClose={() => setExportOpen(false)}
          onConfirm={(onlyWithEvidence) => {
            downloadNumberBatchCsv(fileName, rows, onlyWithEvidence);
            setExportOpen(false);
          }}
        />
      ) : null}
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
  const [exportOpen, setExportOpen] = useState(false);
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
        <div className="evidence-cdr-head evidence-cdr-head-row">
          <div>
            <h2 className="insights-card-title is-table">Combination coverage</h2>
            <p className="evidence-cdr-lede">
              Evidence found for {withEvidence.length.toLocaleString()} of {rows.length.toLocaleString()}{" "}
              A-party → B-party combinations. Open a pair with evidence to review its CDR logs.
            </p>
          </div>
          <button type="button" className="evidence-batch-download" onClick={() => setExportOpen(true)}>
            Download
          </button>
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

      {exportOpen ? (
        <EvidenceBatchExportModal
          fileName={fileName || "A/B party list"}
          totalRows={rows.length}
          evidenceRows={withEvidence.length}
          onClose={() => setExportOpen(false)}
          onConfirm={(onlyWithEvidence) => {
            downloadCombinationBatchCsv(fileName, rows, onlyWithEvidence);
            setExportOpen(false);
          }}
        />
      ) : null}
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
  perspective?: EvidenceSearchPerspective;
  showBPartyVulnerability?: boolean;
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
  perspective = "receiver",
  showBPartyVulnerability = false,
}: EvidenceResultsProps) {
  const [datePreset, setDatePreset] = useState<EvidenceDatePreset>("30");
  const [range, setRange] = useState<DateRange>(() => rangeForPreset("30"));
  const [status, setStatus] = useState<"all" | Exclude<EvidenceIdentifiedAs, "Clean">>("all");
  const [selectedRow, setSelectedRow] = useState<EvidenceCdrRow | null>(null);
  const [reviewById, setReviewById] = useState<Record<string, EvidenceCdrReviewDecision>>({});
  const vulnerabilityState = useDevOverride("evidence.bParty", resolveBPartyResultState(query));
  const exposureProfile =
    vulnerabilityState === "no-evidence" || vulnerabilityState === "zero"
      ? B_PARTY_PROFILE_NO_EVIDENCE
      : B_PARTY_PROFILE;
  const isSenderView = perspective === "sender";

  const cdrThreatRows = useMemo(
    () => rows.filter((row) => row.identifiedAs !== "Clean"),
    [rows],
  );

  const filteredRows = useMemo(
    () =>
      filterEvidenceCdrLogs(rows, {
        range,
        status,
      }),
    [rows, range, status],
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
            {aParty && bParty
              ? "A-party → B-party evidence"
              : isSenderView
                ? "A-party outbound evidence"
                : "B-party inbound evidence"}{" "}
            · {formatDateRange(range)}
          </p>
        </div>
      </header>

      <section className="metrics insights-metrics evidence-metrics" aria-label="Evidence summary">
        <article className="metric-card">
          <p className="metric-label">
            {aParty && bParty
              ? "Messages for this pair"
              : isSenderView
                ? "Total messages sent"
                : "Total messages received"}
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

      {showBPartyVulnerability && !aParty && vulnerabilityState !== "zero" ? (
        <BPartyExposureSummary profile={exposureProfile} className="evidence-exposure" />
      ) : null}

      <section className="table-card insights-table-card evidence-cdr-card" aria-label="CDR logs">
        <div className="evidence-cdr-head">
          <div>
            <h2 className="insights-card-title is-table">
              {aParty && bParty ? "Spam & scam CDR logs for this combination" : "Spam & scam CDR logs"}
            </h2>
            <p className="evidence-cdr-lede">
              {aParty && bParty
                ? `Showing ${filteredRows.length} of ${cdrThreatRows.length} spam or scam messages from this A-party to this B-party.`
                : isSenderView
                  ? `Showing ${filteredRows.length} of ${cdrThreatRows.length} outbound spam or scam messages from this A-party.`
                  : `Showing ${filteredRows.length} of ${cdrThreatRows.length} inbound spam or scam messages for this B-party.`}
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
              onChange={(event) =>
                setStatus(event.target.value as "all" | Exclude<EvidenceIdentifiedAs, "Clean">)
              }
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
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

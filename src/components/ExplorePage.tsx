import { useEffect, useRef, useState, type FormEvent } from "react";
import { assets } from "../assets";
import { addExploreHistory, getExploreHistory, type ExploreHistoryEntry } from "../exploreHistory";
import { APartyResult } from "./APartyResult";
import { CtaResult } from "./CtaResult";
import { MessagePatternDetail } from "./MessagePatternDetail";
import { MessagePatternsList } from "./MessagePatternsList";

export const EXPLORE_TYPES = ["risk-score", "cta", "message-patterns"] as const;
export type ExploreType = (typeof EXPLORE_TYPES)[number];

const SEARCH_TYPES = ["risk-score", "cta"] as const;
type SearchExploreType = (typeof SEARCH_TYPES)[number];

const TYPE_META: Record<
  ExploreType,
  { label: string; placeholder?: string }
> = {
  "risk-score": {
    label: "A-Party Risk Analysis",
    placeholder: "Phone, email, or UPI (e.g. +919876543210)",
  },
  cta: {
    label: "CTA Check",
    placeholder: "Message text or URL (e.g. https://bit.ly/abc)",
  },
  "message-patterns": {
    label: "Message Patterns",
  },
};

function isSearchType(type: ExploreType): type is SearchExploreType {
  return type === "risk-score" || type === "cta";
}

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

export function ExplorePage() {
  const [type, setType] = useState<ExploreType>("risk-score");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [history, setHistory] = useState<ExploreHistoryEntry[]>(() => getExploreHistory("risk-score"));
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchType(type)) {
      setHistory(getExploreHistory(type));
    }
    setHistoryOpen(false);
    setSelectedPatternId(null);
    setSubmitted(false);
    setError("");
  }, [type]);

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
    if (!isSearchType(type)) return;
    const trimmed = nextQuery.trim();
    if (trimmed === "") {
      setSubmitted(false);
      setError("Enter a value to search.");
      return;
    }
    setQuery(trimmed);
    setError("");
    addExploreHistory(type, trimmed);
    setHistory(getExploreHistory(type));
    setHistoryOpen(false);
    setSubmitted(true);
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    runSearch(query);
  }

  function selectHistory(entry: ExploreHistoryEntry) {
    runSearch(entry.query);
  }

  if (type === "message-patterns" && selectedPatternId) {
    return (
      <MessagePatternDetail
        patternId={selectedPatternId}
        onBack={() => setSelectedPatternId(null)}
      />
    );
  }

  if (submitted && type === "risk-score") {
    return <APartyResult query={query} onBack={() => setSubmitted(false)} />;
  }

  if (submitted && type === "cta") {
    return <CtaResult query={query} onBack={() => setSubmitted(false)} />;
  }

  const isPatternsTab = type === "message-patterns";

  return (
    <div className={`main-inner is-explore${isPatternsTab ? " is-explore-patterns" : ""}`}>
      <section className={`explore-landing${isPatternsTab ? " is-patterns" : ""}`}>
        <h1 className="page-title">Explore Intelligence</h1>
        <p className="explore-lede">
          {isPatternsTab
            ? "Browse known scam and phishing message patterns."
            : "Look up a number, UPI, email, or message."}
        </p>

        <div className="explore-types" role="tablist" aria-label="Analysis type">
          {EXPLORE_TYPES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={type === item}
              className={`explore-type${type === item ? " is-active" : ""}`}
              onClick={() => setType(item)}
            >
              {TYPE_META[item].label}
            </button>
          ))}
        </div>

        {isPatternsTab ? (
          <MessagePatternsList onSelect={setSelectedPatternId} />
        ) : (
          <>
            <form className="explore-search" onSubmit={submit}>
              <label className="explore-field">
                <span className="explore-search-icon">
                  <img src={assets.iconExplore} alt="" width={20} height={20} />
                </span>
                <input
                  className="explore-input"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder={TYPE_META[type].placeholder}
                  aria-label={TYPE_META[type].label}
                  aria-invalid={Boolean(error)}
                />
                <div className="explore-history" ref={historyRef}>
                  <button
                    type="button"
                    className="explore-history-btn"
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
                            onClick={() => selectHistory(entry)}
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
              </label>
              <button type="submit" className="btn-primary explore-submit">
                Search
              </button>
            </form>

            {error ? <p className="explore-error">{error}</p> : null}
            {submitted && !error ? (
              <p className="explore-hint">Results for this lookup will appear here.</p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

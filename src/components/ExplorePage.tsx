import { useEffect, useRef, useState, type FormEvent } from "react";
import { assets } from "../assets";
import { resolveCtaResultState, resolvePhoneResultState } from "../exploreData";
import { addExploreHistory, getExploreHistory, type ExploreHistoryEntry } from "../exploreHistory";
import { useDevOverride } from "../devtools";
import { APartyProfileResult } from "./APartyProfileResult";
import { APartyResult } from "./APartyResult";
import { CtaResult } from "./CtaResult";
import { RiskSearchLoader } from "./RiskSearchLoader";
import { MessagePatternDetail } from "./MessagePatternDetail";
import { MessagePatternsList } from "./MessagePatternsList";

export const EXPLORE_TYPES = ["risk-score", "message-patterns", "cta"] as const;
export type ExploreType = (typeof EXPLORE_TYPES)[number];

const SEARCH_TYPES = ["risk-score", "cta"] as const;
type SearchExploreType = (typeof SEARCH_TYPES)[number];

const TYPE_META: Record<ExploreType, { label: string; placeholder: string }> = {
  "risk-score": {
    label: "Number",
    placeholder: "Enter phone number or sender ID",
  },
  "message-patterns": {
    label: "Message",
    placeholder: "Enter message text",
  },
  cta: {
    label: "Link",
    placeholder: "Enter a URL or short link",
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
  const [aPartyLoading, setAPartyLoading] = useState(false);
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
    setAPartyLoading(false);
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
    if (type === "message-patterns") return;
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
    setAPartyLoading(type === "risk-score");
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    runSearch(query);
  }

  function selectHistory(entry: ExploreHistoryEntry) {
    runSearch(entry.query);
  }

  const aParty = useDevOverride(
    "explore.aParty",
    type === "risk-score" && submitted ? resolvePhoneResultState(query) : null,
  );
  const aPartyLayout = useDevOverride<"current" | "profile">("explore.aParty.layout", "profile");
  const cta = useDevOverride(
    "explore.cta",
    type === "cta" && submitted ? resolveCtaResultState(query) : null,
  );

  if (aPartyLoading) {
    return (
      <RiskSearchLoader
        query={query.trim() || "+919876543210"}
        onDone={() => setAPartyLoading(false)}
        onBack={() => {
          setAPartyLoading(false);
          setSubmitted(false);
        }}
      />
    );
  }

  if (aParty) {
    const resultProps = {
      query: query.trim() || "+919876543210",
      onBack: () => setSubmitted(false),
    };
    return aPartyLayout === "profile" ? (
      <APartyProfileResult {...resultProps} />
    ) : (
      <APartyResult {...resultProps} />
    );
  }

  if (cta) {
    return <CtaResult query={query.trim() || "https://bit.ly/abc"} onBack={() => setSubmitted(false)} />;
  }

  if (type === "message-patterns" && selectedPatternId) {
    return (
      <MessagePatternDetail
        patternId={selectedPatternId}
        onBack={() => setSelectedPatternId(null)}
      />
    );
  }

  const isPatternsTab = type === "message-patterns";

  return (
    <div className={`main-inner is-explore${isPatternsTab ? " is-explore-patterns" : ""}`}>
      <section className={`explore-landing${isPatternsTab ? " is-patterns" : ""}`}>
        <div className="explore-heading">
          <h1 className="page-title">Explore Intelligence</h1>
          <p className="explore-lede">
            Check any number, message or link against Wisely AI threat intelligence.
          </p>
        </div>

        <div className="explore-types" role="tablist" aria-label="Check type">
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
          <button type="submit" className="explore-submit">
            Search
          </button>
        </form>

        {error ? <p className="explore-error">{error}</p> : null}

        {isPatternsTab ? <MessagePatternsList query={query} onSelect={setSelectedPatternId} /> : null}
      </section>
    </div>
  );
}

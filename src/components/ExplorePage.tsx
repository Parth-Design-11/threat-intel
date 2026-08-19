import { useState, type FormEvent } from "react";
import { assets } from "../assets";
import { APartyResult } from "./APartyResult";
import { CtaResult } from "./CtaResult";
import { PatternResult } from "./PatternResult";

export const EXPLORE_TYPES = ["risk-score", "cta", "pattern"] as const;
export type ExploreType = (typeof EXPLORE_TYPES)[number];

const TYPE_META: Record<
  ExploreType,
  { label: string; placeholder: string }
> = {
  "risk-score": {
    label: "A-Party Risk Analysis",
    placeholder: "Phone, email, or UPI (e.g. +919876543210)",
  },
  cta: {
    label: "CTA Check",
    placeholder: "Message text or URL (e.g. https://bit.ly/abc)",
  },
  pattern: {
    label: "Message Pattern Analysis",
    placeholder: "Phone, email, or message text",
  },
};

export function ExplorePage() {
  const [type, setType] = useState<ExploreType>("risk-score");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (query.trim() === "") {
      setSubmitted(false);
      setError("Enter a value to search.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  if (submitted && type === "risk-score") {
    return <APartyResult query={query} onBack={() => setSubmitted(false)} />;
  }

  if (submitted && type === "pattern") {
    return <PatternResult query={query} onBack={() => setSubmitted(false)} />;
  }

  if (submitted && type === "cta") {
    return <CtaResult query={query} onBack={() => setSubmitted(false)} />;
  }

  return (
    <div className="main-inner is-explore">
      <section className="explore-landing">
        <h1 className="page-title">Explore Intelligence</h1>
        <p className="explore-lede">Look up a number, UPI, email, or message.</p>

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
          </label>
          <button type="submit" className="btn-primary explore-submit">
            Search
          </button>
        </form>

        {error ? <p className="explore-error">{error}</p> : null}
        {submitted && !error ? (
          <p className="explore-hint">Results for this lookup will appear here.</p>
        ) : null}
      </section>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { assets } from "../assets";
import { MESSAGE_PATTERNS } from "../exploreData";
import { Pagination } from "./Pagination";

type MessagePatternsListProps = {
  onSelect: (patternId: string) => void;
};

const PAGE_SIZE = 5;

export function MessagePatternsList({ onSelect }: MessagePatternsListProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const haystack = query.trim().toLowerCase();
    if (!haystack) return MESSAGE_PATTERNS;
    return MESSAGE_PATTERNS.filter((pattern) => {
      const text = `${pattern.excerpt} ${pattern.useCase} ${pattern.channels}`.toLowerCase();
      return text.includes(haystack);
    });
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="message-patterns-list">
      <div className="message-patterns-toolbar">
        <label className="message-patterns-search">
          <span className="explore-search-icon">
            <img src={assets.iconExplore} alt="" width={20} height={20} />
          </span>
          <input
            className="explore-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter patterns by text, family, or use case"
            aria-label="Filter message patterns"
          />
        </label>
        <p className="message-patterns-count">{filtered.length} patterns</p>
      </div>

      <div className="table-card message-patterns-card">
        <div className="table-wrap">
          <div className="thead message-patterns-head">
            <span className="th">Message Pattern</span>
            <span className="th">Use Case</span>
            <span className="th">Senders</span>
            <span className="th">Attack Counts</span>
            <span className="th">Channels</span>
            <span className="th">Last Observed</span>
          </div>
          {filtered.length === 0 ? (
            <p className="message-patterns-empty">No patterns match your filter.</p>
          ) : (
            paginated.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                className="trow message-patterns-row"
                onClick={() => onSelect(pattern.id)}
              >
                <span className="td">
                  <span className="message-patterns-excerpt" title={pattern.excerpt}>
                    {pattern.excerpt}
                  </span>
                </span>
                <span className="td">{pattern.useCase}</span>
                <span className="td">{pattern.relatedSenders}</span>
                <span className="td">{pattern.totalAttackCounts}</span>
                <span className="td">{pattern.channels}</span>
                <span className="td">{pattern.lastObserved}</span>
              </button>
            ))
          )}
        </div>
        {filtered.length > 0 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { MESSAGE_PATTERNS } from "../exploreData";
import { Pagination } from "./Pagination";

type MessagePatternsListProps = {
  onSelect: (patternId: string) => void;
};

const PAGE_SIZE = 5;

export function MessagePatternsList({ onSelect }: MessagePatternsListProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(MESSAGE_PATTERNS.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return MESSAGE_PATTERNS.slice(start, start + PAGE_SIZE);
  }, [page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="message-patterns-list">
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
          {paginated.map((pattern) => (
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
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

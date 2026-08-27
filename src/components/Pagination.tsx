import { assets } from "../assets";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
};

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }
  if (page >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", page - 1, page, page + 1, "...", totalPages];
}

export function Pagination({ page, totalPages, pageSize, onPageChange }: PaginationProps) {
  const pages = getPageNumbers(page, totalPages);
  const canNavigate = Boolean(onPageChange);

  function goTo(nextPage: number) {
    if (!onPageChange) return;
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    if (clamped !== page) onPageChange(clamped);
  }

  return (
    <div className="pagination">
      <p className="page-info">
        Page {page} of {totalPages}
      </p>
      <div className="page-controls">
        <button
          type="button"
          className="page-nav"
          aria-label="First page"
          disabled={!canNavigate || page === 1}
          onClick={() => goTo(1)}
        >
          <span className="icon">
            <img src={assets.iconArrowLeftDouble} alt="" />
          </span>
        </button>
        <button
          type="button"
          className="page-nav"
          aria-label="Previous page"
          disabled={!canNavigate || page === 1}
          onClick={() => goTo(page - 1)}
        >
          <span className="icon">
            <img src={assets.iconArrowLeft} alt="" />
          </span>
        </button>
        <div className="page-nums">
          {pages.map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="page-ellipsis">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={`page-cell${item === page ? " is-current" : ""}`}
                disabled={!canNavigate || item === page}
                onClick={() => goTo(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <button
          type="button"
          className="page-nav"
          aria-label="Next page"
          disabled={!canNavigate || page === totalPages}
          onClick={() => goTo(page + 1)}
        >
          <span className="icon">
            <img src={assets.iconArrowRight} alt="" />
          </span>
        </button>
        <button
          type="button"
          className="page-nav"
          aria-label="Last page"
          disabled={!canNavigate || page === totalPages}
          onClick={() => goTo(totalPages)}
        >
          <span className="icon">
            <img src={assets.iconArrowRightDouble} alt="" />
          </span>
        </button>
      </div>
      <div className="page-size">
        <button type="button" className="page-size-btn" disabled>
          {pageSize} / page
          <img src={assets.iconCaretDown} alt="" />
        </button>
      </div>
    </div>
  );
}

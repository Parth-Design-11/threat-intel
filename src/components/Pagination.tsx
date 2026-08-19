import { assets } from "../assets";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
};

export function Pagination({ page, totalPages, pageSize }: PaginationProps) {
  const pages = [1, 2, 3, 4, 5, "...", totalPages];

  return (
    <div className="pagination">
      <p className="page-info">
        Page {page} of {totalPages}
      </p>
      <div className="page-controls">
        <button type="button" className="page-nav" aria-label="First page">
          <span className="icon" style={{ width: 20, height: 20 }}>
            <img src={assets.iconArrowLeftDouble} alt="" width={20} height={20} />
          </span>
        </button>
        <button type="button" className="page-nav" aria-label="Previous page">
          <span className="icon" style={{ width: 20, height: 20 }}>
            <img src={assets.iconArrowLeft} alt="" width={20} height={20} />
          </span>
        </button>
        <div className="page-nums">
          {pages.map((item) => (
            <button
              key={String(item)}
              type="button"
              className={`page-cell${item === page ? " is-current" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <button type="button" className="page-nav" aria-label="Next page">
          <span className="icon" style={{ width: 20, height: 20 }}>
            <img src={assets.iconArrowRight} alt="" width={20} height={20} />
          </span>
        </button>
        <button type="button" className="page-nav" aria-label="Last page">
          <span className="icon" style={{ width: 20, height: 20 }}>
            <img src={assets.iconArrowRightDouble} alt="" width={20} height={20} />
          </span>
        </button>
      </div>
      <div className="page-size">
        <button type="button" className="page-size-btn">
          {pageSize} / page
          <img src={assets.iconCaretDown} alt="" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}

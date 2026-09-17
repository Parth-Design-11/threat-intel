import { useEffect, useId, useRef, useState } from "react";
import { assets } from "../assets";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export type DateRange = {
  start: string;
  end: string;
};

type InsightsDateRangeProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

function parseISO(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addMonths(year: number, month: number, delta: number) {
  const date = new Date(year, month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function mondayIndex(year: number, month: number, day = 1) {
  return (new Date(year, month, day).getDay() + 6) % 7;
}

export function formatDateLabel(iso: string) {
  const { year, month, day } = parseISO(iso);
  return `${day} ${MONTHS[month]} ${year}`;
}

export function formatDateRange(range: DateRange) {
  return `${formatDateLabel(range.start)} – ${formatDateLabel(range.end)}`;
}

function orderedRange(a: string, b: string): DateRange {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}

function MonthGrid({
  year,
  month,
  start,
  end,
  onPick,
}: {
  year: number;
  month: number;
  start: string;
  end: string;
  onPick: (iso: string) => void;
}) {
  const blanks = mondayIndex(year, month);
  const count = daysInMonth(year, month);
  const cells = Array.from({ length: blanks + count }, (_, index) => {
    if (index < blanks) return null;
    return toISO(year, month, index - blanks + 1);
  });

  return (
    <div className="insights-range-month">
      <p className="insights-range-month-title">
        {MONTHS[month]} {year}
      </p>
      <div className="insights-range-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="insights-range-days">
        {cells.map((iso, index) => {
          if (!iso) {
            return <span key={`empty-${index}`} />;
          }
          const isStart = iso === start;
          const isEnd = iso === end;
          const inRange = iso >= start && iso <= end;
          return (
            <button
              key={iso}
              type="button"
              className={`insights-range-day${inRange ? " is-in-range" : ""}${isStart ? " is-start" : ""}${isEnd ? " is-end" : ""}`}
              onClick={() => onPick(iso)}
            >
              {parseISO(iso).day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InsightsDateRange({ value, onChange }: InsightsDateRangeProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(value);
  const [picking, setPicking] = useState<"start" | "end">("start");
  const startMonth = parseISO(value.start);

  const [view, setView] = useState<{ year: number; month: number }>({
    year: startMonth.year,
    month: startMonth.month,
  });
  const next = addMonths(view.year, view.month, 1);

  useEffect(() => {
    if (!open) return;
    setDraft(value);
    setPicking("start");
    const nextView = parseISO(value.start);
    setView({ year: nextView.year, month: nextView.month });
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function apply(nextRange: DateRange) {
    const range = orderedRange(nextRange.start, nextRange.end);
    setDraft(range);
    onChange(range);
  }

  function pickDay(iso: string) {
    if (picking === "start") {
      setDraft({ start: iso, end: iso });
      setPicking("end");
      return;
    }
    apply({ start: draft.start, end: iso });
    setPicking("start");
    setOpen(false);
  }

  return (
    <div className="insights-range" ref={rootRef}>
      <button
        type="button"
        className="insights-range-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Reporting period ${formatDateRange(value)}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{formatDateRange(value)}</span>
        <img src={assets.iconCaretDown} alt="" width={10} height={6} />
      </button>
      {open ? (
        <div className="insights-range-panel" id={panelId} role="dialog" aria-label="Choose date range">
          <div className="insights-range-fields">
            <label>
              Start date
              <input
                type="date"
                value={draft.start}
                max={draft.end}
                onChange={(event) => {
                  if (event.target.value) apply({ start: event.target.value, end: draft.end });
                }}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={draft.end}
                min={draft.start}
                onChange={(event) => {
                  if (event.target.value) apply({ start: draft.start, end: event.target.value });
                }}
              />
            </label>
          </div>
          <div className="insights-range-nav">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setView(addMonths(view.year, view.month, -1))}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setView(addMonths(view.year, view.month, 1))}
            >
              ›
            </button>
          </div>
          <div className="insights-range-cals">
            <MonthGrid year={view.year} month={view.month} start={draft.start} end={draft.end} onPick={pickDay} />
            <MonthGrid year={next.year} month={next.month} start={draft.start} end={draft.end} onPick={pickDay} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type PartyMode = "risk" | "vulnerability";

type PartyModeToggleProps = {
  value: PartyMode;
  onChange: (mode: PartyMode) => void;
  /** denser control for result headers */
  compact?: boolean;
};

const OPTIONS: { id: PartyMode; label: string }[] = [
  { id: "risk", label: "Risk" },
  { id: "vulnerability", label: "Vulnerability" },
];

export function PartyModeToggle({ value, onChange, compact = false }: PartyModeToggleProps) {
  return (
    <div
      className={`party-mode${compact ? " is-compact" : ""}`}
      role="tablist"
      aria-label="Number analysis mode"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          className={`party-mode-btn${value === option.id ? " is-active" : ""}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export type PartyMode = "risk" | "vulnerability";

type PartyModeToggleProps = {
  value: PartyMode;
  onChange: (mode: PartyMode) => void;
};

const OPTIONS: { id: PartyMode; label: string }[] = [
  { id: "risk", label: "Risk" },
  { id: "vulnerability", label: "Vulnerability" },
];

export function PartyModeToggle({ value, onChange }: PartyModeToggleProps) {
  return (
    <div className="tabs party-mode-tabs" role="tablist" aria-label="Number analysis mode">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          className={`tab${value === option.id ? " is-active" : ""}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

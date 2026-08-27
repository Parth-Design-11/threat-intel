export type ApiTab = "keys" | "usage" | "playground";

type ApiTabsProps = {
  active: ApiTab;
  onChange: (tab: ApiTab) => void;
  keysLabel?: string;
};

export function ApiTabs({ active, onChange, keysLabel = "API Keys" }: ApiTabsProps) {
  return (
    <div className="tabs">
      <button
        type="button"
        className={`tab${active === "keys" ? " is-active" : ""}`}
        onClick={() => onChange("keys")}
      >
        {keysLabel}
      </button>
      <button
        type="button"
        className={`tab${active === "usage" ? " is-active" : ""}`}
        onClick={() => onChange("usage")}
      >
        Usage and Logs
      </button>
      <button
        type="button"
        className={`tab${active === "playground" ? " is-active" : ""}`}
        onClick={() => onChange("playground")}
      >
        Playground
      </button>
    </div>
  );
}

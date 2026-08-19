export type SettingsTab = "users" | "audit";

type SettingsTabsProps = {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
};

export function SettingsTabs({ active, onChange }: SettingsTabsProps) {
  return (
    <div className="tabs">
      <button
        type="button"
        className={`tab${active === "users" ? " is-active" : ""}`}
        onClick={() => onChange("users")}
      >
        User Management
      </button>
      <button
        type="button"
        className={`tab${active === "audit" ? " is-active" : ""}`}
        onClick={() => onChange("audit")}
      >
        Audit Trail
      </button>
    </div>
  );
}

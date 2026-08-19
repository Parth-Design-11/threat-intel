import { assets } from "../assets";

export type AppSection = "explore" | "api" | "settings";

const ITEMS = [
  { id: "explore", label: "Explore Intelligence", icon: assets.iconExplore },
  { id: "api", label: "API", icon: assets.iconCode },
  { id: "settings", label: "Settings", icon: assets.iconSettings },
] as const;

type SidebarProps = {
  active: AppSection;
  onSelect: (section: AppSection) => void;
};

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="nav">
        {ITEMS.map((item) => {
          const selectable = item.id === "explore" || item.id === "api" || item.id === "settings";
          const isActive = selectable && item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item${isActive ? " is-active" : ""}`}
              onClick={() => {
                if (item.id === "explore" || item.id === "api" || item.id === "settings") {
                  onSelect(item.id);
                }
              }}
            >
              <span className={`nav-icon${item.id === "api" ? " is-code" : ""}`}>
                <img src={item.icon} alt="" width={20} height={item.id === "api" ? 16 : 20} />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

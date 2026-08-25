import { assets } from "../assets";

export type AppSection = "dashboard" | "explore" | "api" | "settings";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: assets.iconHome },
  { id: "explore", label: "Explore Intelligence", icon: assets.iconExplore },
  { id: "api", label: "API", icon: assets.iconCode, isCode: true },
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
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item${isActive ? " is-active" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <span className={`nav-icon${"isCode" in item && item.isCode ? " is-code" : ""}`}>
                <img
                  src={item.icon}
                  alt=""
                  width={20}
                  height={"isCode" in item && item.isCode ? 16 : 20}
                />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

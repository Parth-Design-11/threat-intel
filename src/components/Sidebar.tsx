import { useState } from "react";
import { assets } from "../assets";

export type AppSection = "dashboard" | "explore" | "api" | "settings";
export type DashboardView = "enterprise" | "public";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: assets.iconHome },
  { id: "explore", label: "Explore Intelligence", icon: assets.iconExplore },
  { id: "api", label: "API Management", icon: assets.iconCode, isCode: true },
  { id: "settings", label: "Settings", icon: assets.iconSettings },
] as const;

type SidebarProps = {
  active: AppSection;
  onSelect: (section: AppSection) => void;
};

export function Sidebar({ active, onSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar${collapsed ? " is-collapsed" : ""}`}>
      <button
        type="button"
        className="sidebar-toggle"
        aria-expanded={!collapsed}
        aria-controls="app-sidebar-nav"
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        title={collapsed ? "Expand navigation" : "Collapse navigation"}
        onClick={() => setCollapsed((open) => !open)}
      >
        <img src={assets.iconChevron} alt="" width={16} height={16} />
      </button>
      <nav className="nav" id="app-sidebar-nav">
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item${isActive ? " is-active" : ""}`}
              onClick={() => onSelect(item.id)}
              aria-label={item.label}
              title={collapsed ? item.label : undefined}
            >
              <span className={`nav-icon${"isCode" in item && item.isCode ? " is-code" : ""}`}>
                <img
                  src={item.icon}
                  alt=""
                  width={20}
                  height={"isCode" in item && item.isCode ? 16 : 20}
                />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

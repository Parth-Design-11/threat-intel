import { useState } from "react";
import { assets } from "../assets";
import { WiseAlbertCurtain } from "./WiseAlbertCurtain";
import type { DashboardView } from "./Sidebar";

type TopBarProps = {
  dashboardView: DashboardView;
  onDashboardView: (view: DashboardView) => void;
};

export function TopBar({ dashboardView, onDashboardView }: TopBarProps) {
  const [wiseAlbertOpen, setWiseAlbertOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">
            <img src={assets.logo} alt="Wisely AI" />
          </div>
          <p className="brand-sub">Threat Intelligence</p>
        </div>
        <div className="topbar-actions">
          <label className="topbar-switcher">
            <select
              value={dashboardView}
              aria-label="Dashboard view"
              onChange={(event) => onDashboardView(event.target.value as DashboardView)}
            >
              <option value="enterprise">Enterprise</option>
              <option value="public">Public</option>
            </select>
            <img src={assets.iconCaretDown} alt="" width={10} height={6} />
          </label>
          <button type="button" className="topbar-wise-albert" onClick={() => setWiseAlbertOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1.2 7.8 4.4 11 5.2 7.8 6 7 9.2 6.2 6 3 5.2 6.2 4.4 7 1.2Z" fill="currentColor" />
            </svg>
            Wise Albert
          </button>
          <div className="user-chip">
            <div className="avatar">KD</div>
            <div className="chevron-down">
              <img src={assets.chevronUp} alt="" width={16} height={16} />
            </div>
          </div>
        </div>
      </header>
      {wiseAlbertOpen ? <WiseAlbertCurtain onClose={() => setWiseAlbertOpen(false)} /> : null}
    </>
  );
}

import { assets } from "../assets";

export function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo">
          <img src={assets.logo} alt="Wisely AI" />
        </div>
        <p className="brand-sub">Threat Intelligence</p>
      </div>
      <div className="user-chip">
        <div className="avatar">KD</div>
        <div className="chevron-down">
          <img src={assets.chevronUp} alt="" width={16} height={16} />
        </div>
      </div>
    </header>
  );
}

import { assets } from "../assets";

type DashboardZeroStateProps = {
  onExplore: () => void;
};

export function DashboardZeroState({ onExplore }: DashboardZeroStateProps) {
  return (
    <div className="dashboard-zero-state">
      <div className="dashboard-zero-state-icon" aria-hidden="true">
        <img src={assets.iconExplore} alt="" width={28} height={28} />
      </div>
      <h2 className="dashboard-zero-state-title">No threat activity in this range</h2>
      <p className="dashboard-zero-state-desc">
        We didn’t find smishing, impersonation, or complaint signals for the selected dates.
      </p>
      <button type="button" className="btn-access dashboard-zero-state-cta" onClick={onExplore}>
        Explore intelligence
      </button>
    </div>
  );
}

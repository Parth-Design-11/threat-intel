import { assets } from "../assets";

type ExploreZeroStateProps = {
  title: string;
  description: string;
  hint?: string;
};

export function ExploreZeroState({ title, description, hint }: ExploreZeroStateProps) {
  return (
    <div className="explore-zero-state">
      <div className="explore-zero-state-icon" aria-hidden="true">
        <img src={assets.iconExplore} alt="" width={28} height={28} />
      </div>
      <h2 className="explore-zero-state-title">{title}</h2>
      <p className="explore-zero-state-desc">{description}</p>
      {hint ? <p className="explore-zero-state-hint">{hint}</p> : null}
    </div>
  );
}

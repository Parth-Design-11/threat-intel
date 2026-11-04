import type { ReactNode } from "react";
import { assets } from "../assets";
import { PartyModeToggle, type PartyMode } from "./PartyModeToggle";

type ResultPartyHeaderProps = {
  title: string;
  meta: ReactNode;
  onBack: () => void;
  partyMode: PartyMode;
  onPartyModeChange: (mode: PartyMode) => void;
};

export function ResultPartyHeader({
  title,
  meta,
  onBack,
  partyMode,
  onPartyModeChange,
}: ResultPartyHeaderProps) {
  return (
    <div className="result-top">
      <header className="result-header">
        <button type="button" className="result-back" onClick={onBack} aria-label="Back to search">
          <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
        </button>
        <div className="result-heading">
          <h1 className="result-title">{title}</h1>
          <p className="result-meta">{meta}</p>
        </div>
      </header>
      <PartyModeToggle value={partyMode} onChange={onPartyModeChange} />
    </div>
  );
}

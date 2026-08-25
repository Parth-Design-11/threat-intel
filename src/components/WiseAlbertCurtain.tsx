import { useEffect, useState } from "react";
import { assets } from "../assets";

type WiseAlbertCurtainProps = {
  onClose: () => void;
};

export function WiseAlbertCurtain({ onClose }: WiseAlbertCurtainProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        className={`overlay insights-ai-overlay${entered ? " is-visible" : ""}`}
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className={`insights-ai-curtain wise-albert-curtain${entered ? " is-open" : ""}`}
        role="dialog"
        aria-labelledby="wise-albert-title"
      >
        <button type="button" className="insights-ai-close" aria-label="Close" onClick={onClose}>
          <img src={assets.iconClose} alt="" width={16} height={16} />
        </button>
        <div className="insights-ai-curtain-inner wise-albert-curtain-inner">
          <h2 id="wise-albert-title" className="wise-albert-title">
            Wise Albert
          </h2>
        </div>
      </aside>
    </>
  );
}

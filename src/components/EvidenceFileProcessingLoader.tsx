import { useEffect, useState } from "react";
import { assets } from "../assets";
import evidenceFileProcessingGif from "../assets/figma/evidence-file-processing.gif";

const STEPS = [
  { id: "read", label: "Reading file", duration: 700 },
  { id: "parse", label: "Parsing rows", duration: 850 },
  { id: "match", label: "Matching evidence", duration: 900 },
] as const;

type EvidenceFileProcessingLoaderProps = {
  fileName: string;
  onDone: () => void;
  onBack?: () => void;
};

export function EvidenceFileProcessingLoader({
  fileName,
  onDone,
  onBack,
}: EvidenceFileProcessingLoaderProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    let elapsed = 0;
    STEPS.forEach((_, index) => {
      if (index === 0) return;
      elapsed += STEPS[index - 1].duration;
      timers.push(window.setTimeout(() => setActiveStep(index), elapsed));
    });
    elapsed += STEPS[STEPS.length - 1].duration;
    timers.push(window.setTimeout(onDone, elapsed));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [onDone]);

  return (
    <div className="main-inner is-evidence is-evidence-file-loader">
      {onBack ? (
        <header className="evidence-file-loader-head">
          <button type="button" className="result-back" onClick={onBack} aria-label="Cancel upload">
            <img src={assets.iconArrowLeft} alt="" width={6} height={10} />
          </button>
        </header>
      ) : null}

      <div className="evidence-file-loader" role="status" aria-live="polite" aria-busy="true">
        <img
          className="evidence-file-loader-gif"
          src={evidenceFileProcessingGif}
          alt=""
          width={160}
          height={160}
          aria-hidden="true"
        />

        <div className="evidence-file-loader-copy">
          <h2 className="evidence-file-loader-title">Processing file</h2>
          <p className="evidence-file-loader-name" title={fileName}>
            {fileName}
          </p>
          <p className="evidence-file-loader-lede">Validating numbers and building your evidence results.</p>
        </div>

        <ol className="evidence-file-loader-steps">
          {STEPS.map((step, index) => {
            const state = index < activeStep ? "is-done" : index === activeStep ? "is-active" : "";
            return (
              <li key={step.id} className={state}>
                {step.label}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
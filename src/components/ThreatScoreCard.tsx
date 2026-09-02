import { assets } from "../assets";

type ThreatScoreCardProps = {
  score: number;
  label: string;
};

export function ThreatScoreCard({ score, label }: ThreatScoreCardProps) {
  return (
    <article className="threat-score-card">
      <p className="threat-score-label">THREAT SCORE</p>
      <div className="threat-meter">
        <div className="threat-meter-base">
          <div className="threat-meter-layer">
            <div className="threat-meter-leaf is-bg">
              <img src={assets.threatMeterBg} alt="" width={211.961} height={112} />
            </div>
          </div>
          <div className="threat-meter-layer">
            <div className="threat-meter-leaf is-needle">
              <img src={assets.threatMeterNeedle} alt="" width={205.913} height={106} />
            </div>
          </div>
          <div className="threat-meter-layer">
            <img src={assets.threatMeterSegmentHigh} alt="" width={200} height={100} />
          </div>
          <div className="threat-meter-layer">
            <img src={assets.threatMeterSegmentMid} alt="" width={200} height={100} />
          </div>
          <div className="threat-meter-layer">
            <img src={assets.threatMeterSegmentLow} alt="" width={200} height={100} />
          </div>
          <div className="threat-meter-layer">
            <div className="threat-meter-ellipse">
              <div className="threat-meter-leaf is-ellipse">
                <img src={assets.threatMeterEllipse} alt="" width={42.144} height={57.587} />
              </div>
            </div>
            <div className="threat-meter-readout">
              <p className="threat-meter-score">{score}</p>
              <span className="threat-meter-chip">{label}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

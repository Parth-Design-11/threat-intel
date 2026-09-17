import { assets } from "../assets";
import iconArrowUp from "../assets/public/icon-arrow-up.svg";
import iconLink from "../assets/public/icon-link.svg";
import iconLive from "../assets/public/icon-live.svg";
import iconLocation from "../assets/public/icon-location.svg";
import iconMask from "../assets/public/icon-mask.svg";
import mapOrigin from "../assets/public/map-origin.png";
import mapTarget from "../assets/public/map-target.png";
import iconSpark from "../assets/public/icon-spark.svg";
import iconTrend from "../assets/public/icon-trend.svg";
import { InsightsAiSection } from "./InsightsAiSection";
import { PUBLIC_CTA_BARS, PUBLIC_GAMBLING, PUBLIC_LANDSCAPE } from "../publicDashboardData";

const LANDSCAPE_ICONS = {
  blue: assets.iconUser,
  purple: iconMask,
  pink: iconLink,
} as const;

type PublicDashboardProps = {
  onGetApi: () => void;
};

export function PublicDashboard({ onGetApi }: PublicDashboardProps) {
  return (
    <div className="main-inner is-public">
      <section className="public-landscape" aria-label="Threat landscape">
        <div className="public-landscape-card">
          <p className="public-landscape-kicker">Threat Landscape</p>
          <div className="public-landscape-stats">
            {PUBLIC_LANDSCAPE.map((stat) => (
              <div key={stat.label} className="public-landscape-stat">
                <span className={`public-landscape-orb is-${stat.tone}`}>
                  <img src={LANDSCAPE_ICONS[stat.tone]} alt="" width={24} height={24} />
                </span>
                <div>
                  <p className="public-landscape-value">{stat.value}</p>
                  <p className="public-landscape-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="public-focus-head">
        <div className="public-focus-title">
          <span className="public-live-dot">
            <img src={iconLive} alt="" width={9} height={10} />
          </span>
          <div>
            <h1>THREATS IN FOCUS</h1>
            <p>Last Refreshed 5 mins ago</p>
          </div>
        </div>
        <div className="public-focus-rule" />
        <button type="button" className="public-get-api" onClick={onGetApi}>
          Get API
        </button>
      </div>

      <div className="public-grid">
        <InsightsAiSection className="is-public-col" />

        <div className="public-mid">
          <article className="public-card">
            <header className="public-card-head">
              <span className="public-card-icon is-20">
                <img src={iconTrend} alt="" width={17} height={10} />
              </span>
              <h2>Scam Links Dominate</h2>
            </header>
            <p className="public-card-copy">
              In the last 7 days, scam CTAs are overwhelmingly link-based:{" "}
              <strong>Short URLs (6.92M, ~56%)</strong> and <strong>URLs (5.50M, ~44%)</strong>. All other
              CTAs are negligible by volume:{" "}
              <strong>Mobile numbers (10.3K, 0.08%), WhatsApp (2.9K, 0.02%), Email (26, ~0%).</strong>
            </p>
            <div className="public-cta-chart" aria-hidden="true">
              <p className="public-chart-kicker">Distribution of CTA types for scam messages (last 7 days)</p>
              <div className="public-cta-plot">
                <div className="public-cta-axis">
                  {["7M", "6M", "5M", "4M", "3M", "2M", "1M", "0"].map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
                <div className="public-cta-bars">
                  {PUBLIC_CTA_BARS.map((bar) => (
                    <div key={bar.label} className="public-cta-col">
                      <div className="public-cta-track">
                        <span style={{ height: `${bar.height}%` }} />
                      </div>
                      <p>{bar.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="public-card">
            <header className="public-card-head">
              <span className="public-card-icon is-20">
                <img src={iconLink} alt="" width={20} height={20} />
              </span>
              <h2>Gambling Far Ahead</h2>
            </header>
            <p className="public-card-copy">
              Gambling Scam is the most used scam category in the last 7 days, with{" "}
              <strong>8,228,842 scam SMS</strong>—far exceeding the next highest,{" "}
              <strong>Prize & Rewards Scam (2,005,078).</strong>
            </p>
            <div className="public-bars">
              {PUBLIC_GAMBLING.map((row) => (
                <div key={row.label} className="public-bar-row">
                  <div className="public-bar-meta">
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                  <div className="public-bar-track">
                    <span style={{ width: `${row.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="public-right">
          <article className="public-card is-stat">
            <div className="public-stat-value">
              <span>24k</span>
              <i>
                <img src={iconArrowUp} alt="" width={12} height={12} />
                0.69 %
              </i>
            </div>
            <p className="public-stat-label">
              <img src={iconMask} alt="" width={20} height={20} />
              Active Scammers today
            </p>
          </article>

          <article className="public-card is-map">
            <header className="public-card-head">
              <span className="public-card-icon is-20">
                <img src={iconLocation} alt="" width={17.33} height={17.33} />
              </span>
              <h2>Threat Originations</h2>
              <p className="public-live">LIVE JUST NOW</p>
            </header>
            <img className="public-map" src={mapOrigin} alt="Indonesia originations map" width={537} height={194} />
            <p className="public-map-note">
              <img src={iconSpark} alt="" width={16.02} height={16} />
              3 scam attempts per scammer
            </p>
          </article>

          <article className="public-card is-map">
            <header className="public-card-head">
              <span className="public-card-icon is-20">
                <img src={iconLocation} alt="" width={17.33} height={17.33} />
              </span>
              <h2>Threat Originations</h2>
              <p className="public-live">LIVE JUST NOW</p>
            </header>
            <img className="public-map" src={mapTarget} alt="Indonesia targeted map" width={537} height={194} />
            <p className="public-map-note">
              <img src={iconSpark} alt="" width={16.02} height={16} />
              5 scam attempts per victim
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

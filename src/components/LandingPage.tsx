import type { MouseEvent } from "react";
import { landingAssets as a } from "../landingAssets";
import { navigateTo } from "../navigate";
import { LandingProof } from "./LandingProof";

function openDashboard(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }
  event.preventDefault();
  navigateTo("/");
}

const STARS = [
  [1297.81, 751.93, 0.38],
  [1165.64, 537.44, 0.6],
  [174.05, 245.96, 0.61],
  [798.59, 95.19, 0.39],
  [1194.66, 198.68, 0.58],
  [1191.38, 294.38, 0.47],
  [786.16, 22.22, 0.36],
  [872.95, 559.84, 0.56],
  [1049, 432.84, 0.79],
  [453.27, 786.84, 0.43],
  [478.14, 32.4, 0.78],
  [705.92, 374.63, 0.25],
  [108.56, 732.31, 0.21],
  [769.34, 133.35, 0.58],
  [96.31, 90.35, 0.5],
  [971.16, 656.01, 0.26],
  [132.88, 438.69, 0.21],
  [591.3, 311.96, 0.29],
  [118.94, 715.93, 0.4],
  [1352.39, 490.61, 0.56],
] as const;

const BARS = [
  { label: "Domains", width: 410, fill: a.barDomains },
  { label: "WhatsApp URLs", width: 347, fill: a.barWhatsapp },
  { label: "Phone Numbers", width: 264, fill: a.barPhones },
  { label: "Emails", width: 201, fill: a.barEmails },
] as const;

const USE_CASES = [
  { label: "Gambling Fraud", color: "#003bbe" },
  { label: "Job Fraud", color: "#0e59dc" },
  { label: "Fake Loan", color: "#408bff" },
  { label: "Dating Fraud", color: "#75abff" },
  { label: "WhatsApp Number", color: "#c1ddfb" },
  { label: "Message Pattern", color: "#e5f1fd" },
] as const;

const SOURCES = ["identity & location", "Activity History", "Digital Assets", "Evidences", "100 more"] as const;

const OUTCOMES = [
  { label: "Identity Verification", icon: a.iconVerify, kind: "verify" as const },
  { label: "Mule Account Detection", icon: a.iconVoice, kind: "voice" as const },
  { label: "Threat Removal", icon: a.iconWebRemove, kind: "web" as const },
  { label: "Law Enforcement", icon: a.iconPolice, kind: "police" as const },
] as const;

const PARTNERS = [
  {
    name: "Enterprises",
    copy: "Stop bad actors at the point of onboarding by cross-referencing global and local threat signatures.",
    icon: a.iconEnterprise,
    boxed: true,
    usecaseLabel: "Usecases",
    chips: ["Identity Verification", "Account Takeover Prevention", "Promo Abuse Prevention"],
  },
  {
    name: "Regulators",
    copy: "Identify and deactivate malicious phone numbers and fraudulent credentials instantly.",
    icon: a.iconRegulators,
    boxed: false,
    usecaseLabel: "Usecase",
    chips: ["National Blacklist Management", "Threat Removal"],
  },
  {
    name: "Law Enforcement Agencies",
    copy: "Access to the deep forensic insights and data-backed evidence required to bring fraudsters to justice.",
    icon: a.iconPoliceLg,
    boxed: true,
    usecaseLabel: "Usecase",
    chips: ["Law Enforcement", "Syndicate mapping", "Digital Forensic Evidence"],
  },
  {
    name: "Telecoms",
    copy: "Detect and block high-risk transactions before they occur in real-time.",
    icon: a.iconTower,
    boxed: true,
    usecaseLabel: "Usecase",
    chips: ["Scam URL, Caller ID Sync", "Enhanced scam signal", "Device check"],
  },
] as const;

export function LandingPage() {
  return (
    <div className="lp">
      <header className="lp-nav">
        <a className="lp-brand" href="/landing-page">
          <div className="lp-brand-logo">
            <img src={a.logoWisely} alt="Wisely AI" width={79.387} height={24.34} />
          </div>
          <p className="lp-brand-sub">Threat Intelligence</p>
        </a>
        <div className="lp-nav-actions">
          <nav className="lp-nav-links" aria-label="Landing">
            <a className="lp-nav-link" href="#faqs">
              FAQs
            </a>
            <a className="lp-nav-link" href="#blog">
              Blog
            </a>
            <a className="lp-nav-link" href="#api">
              API Docs
            </a>
            <a className="lp-nav-link" href="/" onClick={openDashboard}>
              Sign In
            </a>
          </nav>
          <a className="lp-btn-register" href="/">
            Register
          </a>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-glow is-blue" />
        <div className="lp-hero-glow is-purple" />
        <div className="lp-hero-glow is-cyan" />
        <div className="lp-hero-stars" aria-hidden="true">
          {STARS.map(([left, top, opacity]) => (
            <span key={`${left}-${top}`} className="lp-hero-star" style={{ left, top, opacity }} />
          ))}
        </div>
        <div className="lp-hero-inner">
          <div className="lp-live">
            <span className="lp-live-dot" />
            22,000+ new threats detected daily
          </div>
          <h1 className="lp-hero-title">
            <span className="lp-hero-title-grad">Real-time Threat Intelligence</span>
            <span className="lp-hero-title-rest">on Digital Scams</span>
          </h1>
          <p className="lp-hero-copy">
            A high-fidelity engine built to neutralise digital threat infrastructure.
            <br />
            Powered by an intelligence repository of <strong>1.3 million threats</strong> and growing
          </p>
          <div className="lp-hero-cta">
            <a className="lp-btn-hero" href="/">
              Register
              <img src={a.iconArrow} alt="" width={20} height={20} />
            </a>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat">
              <p className="lp-stat-value">1.3M+</p>
              <p className="lp-stat-label">Threats Detected</p>
            </div>
            <div className="lp-stat">
              <p className="lp-stat-value">&lt;5min</p>
              <p className="lp-stat-label">Detection Time</p>
            </div>
            <div className="lp-stat">
              <p className="lp-stat-value">100M+</p>
              <p className="lp-stat-label">Users Protected</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-landscape-wrap" aria-label="Threat landscape">
        <div className="lp-landscape-summary">
          <p className="lp-landscape-kicker">THREAT LANDSCAPE</p>
          <div className="lp-landscape-metrics">
            <div className="lp-landscape-metric">
              <div className="lp-landscape-value">
                1.3M
                <img src={a.iconTrendUp} alt="" width={20} height={20} />
              </div>
              <div className="lp-landscape-caption">
                <img src={a.iconMask} alt="" width={20} height={20} />
                Total Scammers
              </div>
            </div>
            <div className="lp-landscape-metric">
              <div className="lp-landscape-value">
                15
                <img src={a.iconTrendUp} alt="" width={20} height={20} />
              </div>
              <div className="lp-landscape-caption">
                <img src={a.iconPie} alt="" width={20} height={20} />
                Scam Types
              </div>
            </div>
            <div className="lp-landscape-metric">
              <div className="lp-landscape-value">
                55k
                <img src={a.iconTrendUp} alt="" width={20} height={20} />
              </div>
              <div className="lp-landscape-caption">
                <img src={a.iconLink} alt="" width={20} height={20} />
                Malicious CTAs
              </div>
            </div>
          </div>
        </div>

        <div className="lp-landscape-split">
          <div className="lp-panel is-cta">
            <div className="lp-panel-head">
              <p className="lp-panel-title is-upper">Top malicious CTAs</p>
            </div>
            <div className="lp-bars">
              {BARS.map((bar) => (
                <div key={bar.label} className="lp-bar-row">
                  <p className="lp-bar-label">{bar.label}</p>
                  <div className="lp-bar-track">
                    <div
                      className="lp-bar-fill"
                      style={{ width: bar.width, backgroundImage: `url(${bar.fill})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-panel is-usecase">
            <div className="lp-panel-head">
              <p className="lp-panel-title">TOP SCAM USECASES</p>
            </div>
            <div className="lp-usecase-body">
              <div className="lp-pie" aria-hidden="true">
                <div className="lp-pie-stage">
                  <div className="lp-pie-s lp-pie-s1">
                    <img src={a.pie1} alt="" width={96.78} height={91} />
                  </div>
                  <div className="lp-pie-s lp-pie-s2">
                    <img src={a.pie2} alt="" width={67.16} height={57.28} />
                  </div>
                  <div className="lp-pie-s lp-pie-s3">
                    <img src={a.pie3} alt="" width={49.19} height={111.82} />
                  </div>
                  <div className="lp-pie-s lp-pie-s4">
                    <img src={a.pie4} alt="" width={81.74} height={54.27} />
                  </div>
                  <div className="lp-pie-s lp-pie-s5">
                    <img src={a.pie5} alt="" width={63.82} height={57.39} />
                  </div>
                  <div className="lp-pie-s lp-pie-s6">
                    <img src={a.pie6} alt="" width={45.54} height={49.56} />
                  </div>
                  <div className="lp-pie-hole" />
                </div>
              </div>
              <div className="lp-legend">
                {USE_CASES.map((item) => (
                  <div key={item.label} className="lp-legend-row">
                    <span className="lp-swatch" style={{ background: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-impact">
        <div>
          <h2 className="lp-section-title">
            Wisely<small>Ai</small> Intelligence and Impact
          </h2>
          <p className="lp-section-copy">
            The platform detects sophisticated fraud signals in under 5 minutes, providing the technical
            infrastructure to prevent potential financial losses for citizens and enterprises.
          </p>
        </div>
        <div className="lp-radar-board" aria-hidden="true">
          <div className="lp-radar-sources">
            {SOURCES.map((label) => (
              <div key={label} className="lp-radar-chip">
                <img src={a.dotSignal} alt="" width={9} height={9} />
                {label}
              </div>
            ))}
          </div>
          <div className="lp-radar-midleft">
            <div className="lp-radar-chip is-wrap">{`Threat Signals from \nNetwork & Device`}</div>
          </div>
          <div className="lp-conn is-line">
            <img src={a.lineToRadar} alt="" />
          </div>
          <div className="lp-conn is-7">
            <img src={a.conn7} alt="" />
          </div>
          <div className="lp-conn is-8">
            <img src={a.conn8} alt="" />
          </div>
          <div className="lp-conn is-9">
            <img src={a.conn9} alt="" />
          </div>
          <div className="lp-conn is-10">
            <img src={a.conn10} alt="" />
          </div>
          <div className="lp-conn is-11">
            <img src={a.conn11} alt="" />
          </div>
          <div className="lp-conn is-12">
            <img src={a.conn12} alt="" />
          </div>
          <div className="lp-conn is-13">
            <img src={a.conn13} alt="" />
          </div>
          <div className="lp-conn is-14">
            <img src={a.conn14} alt="" />
          </div>
          <div className="lp-conn is-15">
            <img src={a.conn15} alt="" />
          </div>
          <div className="lp-conn is-16">
            <img src={a.conn15} alt="" />
          </div>
          <div className="lp-conn is-17">
            <img src={a.conn17} alt="" />
          </div>

          <div className="lp-radar">
            <img className="lp-radar-ring is-glow-b" src={a.radarGlowB} alt="" width={252} height={252} />
            <img className="lp-radar-ring is-glow-a" src={a.radarGlowA} alt="" width={220} height={220} />
            <img className="lp-radar-ring is-outer" src={a.radarRingOuter} alt="" width={214} height={214} />
            <img className="lp-radar-ring is-mid" src={a.radarRingMid} alt="" width={158} height={158} />
            <img className="lp-radar-ring is-inner" src={a.radarRingInner} alt="" width={92} height={92} />
            <img className="lp-radar-cross" src={a.radarLineH} alt="" />
            <img className="lp-radar-cross is-v" src={a.radarLineV} alt="" />
            <div className="lp-radar-diag" style={{ transform: "rotate(45deg)" }}>
              <img src={a.radarLineD1} alt="" />
            </div>
            <div className="lp-radar-diag" style={{ transform: "rotate(-45deg)" }}>
              <img src={a.radarLineD2} alt="" />
            </div>
            <img className="lp-radar-radius" src={a.radarRadius} alt="" width={27} height={27} />
            <img className="lp-radar-dot is-s" src={a.radarDotA} alt="" />
            <img className="lp-radar-dot is-e" src={a.radarDotB} alt="" />
            <img className="lp-radar-dot is-n" src={a.radarDotD} alt="" />
            <img className="lp-radar-sweep" src={a.radarSweep} alt="" width={243} height={243} />
            <div className="lp-radar-w">
              <div className="lp-radar-w-mark">
                <img src={a.logoWMask} alt="" width={129} height={37} />
              </div>
            </div>
            <img className="lp-radar-mark" src={a.iconIntelligence} alt="" width={49} height={49} />
            <p className="lp-radar-caption">
              Wisely<small>Ai </small>Threat intelligence
            </p>
          </div>

          <div className="lp-radar-midright">
            <div className="lp-radar-chip is-wrap">{`LIVE \nThreat insights`}</div>
          </div>
          <div className="lp-radar-outcomes">
            {OUTCOMES.map((item) => (
              <div key={item.label} className="lp-outcome">
                <img className="lp-outcome-orb" src={a.iconCircleBg} alt="" width={30} height={30} />
                <img className={`lp-outcome-icon is-${item.kind}`} src={item.icon} alt="" />
                <div className="lp-radar-chip is-tight">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingProof />

      <section className="lp-partners" id="api">
        <div>
          <h2 className="lp-section-title">Sharing threat insights across key ecosystem partners</h2>
          <p className="lp-section-copy">
            WiselyAi delivers real-time, actionable intelligence through low-latency APIs, integrating
            seamlessly into existing security systems for a unified national defense
          </p>
        </div>
        <div className="lp-partner-grid">
          {PARTNERS.map((card) => (
            <article key={card.name} className="lp-partner">
              <div className="lp-partner-top">
                <div className={`lp-partner-icon${card.boxed ? "" : " is-plain"}`}>
                  <img src={card.icon} alt="" width={card.boxed ? 40 : 50} height={card.boxed ? 40 : 50} />
                </div>
                <div>
                  <h3 className="lp-partner-name">{card.name}</h3>
                  <p className="lp-partner-copy">{card.copy}</p>
                </div>
              </div>
              <div className="lp-partner-rule" />
              <div>
                <p className="lp-usecases-label">{card.usecaseLabel}</p>
                <div className="lp-chips">
                  {card.chips.map((chip) => (
                    <span key={chip} className="lp-chip">
                      <img src={a.iconTick} alt="" width={16} height={16} />
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <a className="lp-api-link" href="#api">
                Read API Document
              </a>
            </article>
          ))}
        </div>
        <a className="lp-btn-register is-lg" href="/">
          Register
        </a>
      </section>

      <section className="lp-contribute" id="contribute">
        <div className="lp-contribute-card">
          <div className="lp-contribute-grid" aria-hidden="true">
            <img src={a.gridHori} alt="" width={1533} height={1775} />
            <img src={a.gridVerti} alt="" width={1533} height={1167} style={{ left: 47, top: 183 }} />
          </div>
          <div className="lp-contribute-copy">
            <div className="lp-contribute-text">
              <h2>Contribute to our intelligence and earn rewards</h2>
              <p>
                Through our WhatsApp-based chatbot, 100 million Indonesians can report suspicious activity
                directly
              </p>
            </div>
            <div className="lp-contribute-scan">
              <div className="lp-qr">
                <div className="lp-qr-clip">
                  <img
                    src={a.qrContribute}
                    alt="WhatsApp QR code to contribute threat reports"
                    width={345}
                    height={230}
                  />
                </div>
              </div>
              <p>SCAN TO CONTRIBUTE</p>
            </div>
          </div>
          <div className="lp-phones">
            <div className="lp-phone is-back">
              <img src={a.phoneB} alt="WhatsApp conversation asking for a scammer number" width={217} height={457} />
            </div>
            <div className="lp-phone is-front">
              <img src={a.phoneA} alt="WhatsApp chatbot inviting threat reports" width={217} height={457} />
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer" id="faqs">
        <div className="lp-footer-row">
          <div className="lp-footer-col">
            <div className="lp-powered">
              <p className="lp-footer-kicker">Powered by</p>
              <img src={a.logoTonik} alt="Tanla ValueFirst" width={89} height={24} />
            </div>
            <div className="lp-partnered">
              <p className="lp-footer-kicker">In Partnership with</p>
              <img src={a.logoIoh} alt="IOH Business" width={82} height={24} />
            </div>
          </div>
          <div className="lp-footer-col">
            <p className="lp-footer-kicker">Company</p>
            <a className="lp-footer-link" href="#products">
              Products
            </a>
            <a className="lp-footer-link" href="#faqs">
              FAQs
            </a>
            <a className="lp-footer-link" href="#blog">
              Blog
            </a>
            <a className="lp-footer-link" href="#api">
              API Docs
            </a>
          </div>
          <div className="lp-footer-col">
            <p className="lp-footer-kicker">Legal</p>
            <a className="lp-footer-link" href="#terms">
              Terms of Service
            </a>
            <a className="lp-footer-link" href="#privacy">
              Privacy Policy
            </a>
          </div>
          <div className="lp-footer-col">
            <p className="lp-footer-kicker">Social</p>
            <div className="lp-socials">
              <a href="https://www.facebook.com" aria-label="Facebook">
                <img src={a.iconFacebook} alt="" width={24} height={24} />
              </a>
              <a href="https://www.linkedin.com" aria-label="LinkedIn">
                <img src={a.iconLinkedin} alt="" width={24} height={24} />
              </a>
              <a href="https://www.youtube.com" aria-label="YouTube">
                <img src={a.iconYoutube} alt="" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="lp-footer-rule" />
        <p className="lp-footer-copy">© 2026 Wisely.Ai Threat Intelligence</p>
      </footer>
    </div>
  );
}

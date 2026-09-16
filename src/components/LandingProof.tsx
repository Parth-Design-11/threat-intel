const PROOF = [
  {
    id: "imei",
    title: "IMEI and device details",
    copy: "Reads the physical handset on a number — IMEI, TAC, and manufacturer — so a new device after SIM theft is visible.",
  },
  {
    id: "sna",
    title: "Number Validation (SNA)",
    copy: "Confirms the number belongs to the authenticated device over the operator network. No SMS OTP to intercept.",
  },
  {
    id: "sim",
    title: "SIM Swap Subscription",
    copy: "Pushes a notification the moment the SIM behind a watched number changes, instead of polling at transaction time.",
  },
  {
    id: "device",
    title: "Device Swap",
    copy: "Flags when the same mobile line appears on a different physical device — a core account-takeover signal.",
  },
  {
    id: "kyc",
    title: "KYC match",
    copy: "Compares name, ID, and address against the operator record. Returns match outcomes, not the raw KYC data.",
  },
] as const;

function SceneImei() {
  return (
    <div className="lp-proof-scene is-imei" aria-hidden="true">
      <div className="lp-proof-phone">
        <span className="lp-proof-scan" />
        <span className="lp-proof-imei">
          <i>3</i>
          <i>5</i>
          <i>8</i>
          <i>9</i>
          <i>0</i>
          <i>1</i>
          <i>2</i>
          <i>3</i>
          <i>4</i>
          <i>5</i>
          <i>6</i>
          <i>7</i>
          <i>8</i>
          <i>9</i>
          <i>1</i>
        </span>
      </div>
      <p className="lp-proof-tag">TAC 35890123 · Samsung</p>
    </div>
  );
}

function SceneSna() {
  return (
    <div className="lp-proof-scene is-sna" aria-hidden="true">
      <div className="lp-proof-sna-node is-msisdn">+91 98765 43210</div>
      <svg className="lp-proof-sna-arc" viewBox="0 0 160 48" fill="none">
        <path d="M8 40 C 40 4, 120 4, 152 40" />
        <circle className="lp-proof-sna-pulse" cx="8" cy="40" r="4" />
        <circle className="lp-proof-sna-pulse is-b" cx="152" cy="40" r="4" />
      </svg>
      <div className="lp-proof-sna-node is-net">NETWORK AUTH</div>
      <span className="lp-proof-seal">MATCH · TRUE</span>
    </div>
  );
}

function SceneSim() {
  return (
    <div className="lp-proof-scene is-sim" aria-hidden="true">
      <div className="lp-proof-tray">
        <span className="lp-proof-chip is-out">SIM A</span>
        <span className="lp-proof-chip is-in">SIM B</span>
      </div>
      <span className="lp-proof-alert">SWAP EVENT</span>
    </div>
  );
}

function SceneDevice() {
  return (
    <div className="lp-proof-scene is-device" aria-hidden="true">
      <p className="lp-proof-line">+91 98765 43210</p>
      <div className="lp-proof-handsets">
        <span className="lp-proof-handset is-old" />
        <span className="lp-proof-handset is-new" />
      </div>
      <span className="lp-proof-alert is-soft">DEVICE CHANGED</span>
    </div>
  );
}

function SceneKyc() {
  return (
    <div className="lp-proof-scene is-kyc" aria-hidden="true">
      <div className="lp-proof-kyc-row">
        <span>A. Rahman</span>
        <i />
        <span>A. Rahman</span>
        <b>TRUE</b>
      </div>
      <div className="lp-proof-kyc-row">
        <span>12 Mar 1991</span>
        <i />
        <span>12 Mar 1991</span>
        <b>TRUE</b>
      </div>
      <div className="lp-proof-kyc-row is-score">
        <span>Jakarta</span>
        <i />
        <span>DKI Jakarta</span>
        <b>0.92</b>
      </div>
    </div>
  );
}

const SCENES = {
  imei: SceneImei,
  sna: SceneSna,
  sim: SceneSim,
  device: SceneDevice,
  kyc: SceneKyc,
} as const;

export function LandingProof() {
  return (
    <section className="lp-proof" id="proof">
      <div className="lp-proof-intro">
        <h2 className="lp-section-title">Intelligence with proof</h2>
        <p className="lp-section-copy">
          Each risk call is backed by operator network APIs. These CAMARA signals confirm the device, the
          number, the SIM, and the identity — not a screen scrape or an SMS guess.
        </p>
      </div>
      <div className="lp-proof-track">
        {PROOF.map((card) => {
          const Scene = SCENES[card.id];
          return (
            <article key={card.id} className={`lp-proof-card is-${card.id}`}>
              <div className="lp-proof-stage">
                <Scene />
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

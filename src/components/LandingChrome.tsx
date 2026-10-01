import type { MouseEvent } from "react";
import { landingAssets as a } from "../landingAssets";
import { navigateTo } from "../navigate";

function allowClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function openSignIn(event: MouseEvent<HTMLAnchorElement>) {
  if (allowClick(event)) return;
  event.preventDefault();
  navigateTo("/sign-in");
}

export function openRegister(event: MouseEvent<HTMLAnchorElement>) {
  if (allowClick(event)) return;
  event.preventDefault();
  navigateTo("/register");
}

export function openThreatIntelligence(event: MouseEvent<HTMLAnchorElement>) {
  if (allowClick(event)) return;
  event.preventDefault();
  navigateTo("/threat-intelligence");
}

export function openFaqs(event: MouseEvent<HTMLAnchorElement>) {
  if (allowClick(event)) return;
  event.preventDefault();
  navigateTo("/faqs");
}

function sectionHref(hash: string, hashPrefix = "") {
  return `${hashPrefix}${hash}`;
}

function openLanding(event: MouseEvent<HTMLAnchorElement>) {
  if (allowClick(event)) return;
  event.preventDefault();
  navigateTo("/landing-page");
}

function openSection(hashPrefix: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (!hashPrefix || allowClick(event)) return;
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href") ?? "";
    const hash = href.slice(href.indexOf("#"));
    navigateTo("/landing-page");
    if (!hash.startsWith("#")) return;
    window.history.replaceState({}, "", `/landing-page${hash}`);
    window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView();
    }, 0);
  };
}

type LandingChromeProps = {
  hashPrefix?: string;
  showPartnership?: boolean;
};

export function LandingNav() {
  return (
    <header className="lp-nav">
      <a className="lp-brand" href="/landing-page" onClick={openLanding}>
        <div className="lp-brand-logo">
          <img src={a.logoWisely} alt="Wisely AI" width={79.387} height={24.34} />
        </div>
        <p className="lp-brand-sub">Threat Intelligence</p>
      </a>
      <div className="lp-nav-actions">
        <nav className="lp-nav-links" aria-label="Landing">
          <a className="lp-nav-link" href="/threat-intelligence" onClick={openThreatIntelligence}>
            Our Intelligence
          </a>
          <a className="lp-nav-link" href="/faqs" onClick={openFaqs}>
            FAQs
          </a>
          <a className="lp-nav-link" href="/sign-in" onClick={openSignIn}>
            Sign In
          </a>
        </nav>
        <a className="lp-btn-register" href="/register" onClick={openRegister}>
          Register
        </a>
      </div>
    </header>
  );
}

export function LandingFooter({ hashPrefix = "", showPartnership = true }: LandingChromeProps) {
  const goSection = openSection(hashPrefix);

  return (
    <footer className="lp-footer">
      <div className="lp-footer-row">
        <div className="lp-footer-col">
          <div className="lp-powered">
            <p className="lp-footer-kicker">Powered by</p>
            <img src={a.logoTonik} alt="Tanla ValueFirst" width={89} height={24} />
          </div>
          {showPartnership ? (
            <div className="lp-partnered">
              <p className="lp-footer-kicker">In Partnership with</p>
              <img src={a.logoIoh} alt="IOH Business" width={82} height={24} />
            </div>
          ) : null}
        </div>
        <div className="lp-footer-col">
          <p className="lp-footer-kicker">Company</p>
          <a className="lp-footer-link" href={sectionHref("#products", hashPrefix)} onClick={goSection}>
            Products
          </a>
          <a className="lp-footer-link" href="/faqs" onClick={openFaqs}>
            FAQs
          </a>
          <a className="lp-footer-link" href={sectionHref("#blog", hashPrefix)} onClick={goSection}>
            Blog
          </a>
          <a className="lp-footer-link" href={sectionHref("#api", hashPrefix)} onClick={goSection}>
            API Docs
          </a>
        </div>
        <div className="lp-footer-col">
          <p className="lp-footer-kicker">Legal</p>
          <a className="lp-footer-link" href={sectionHref("#terms", hashPrefix)} onClick={goSection}>
            Terms of Service
          </a>
          <a className="lp-footer-link" href={sectionHref("#privacy", hashPrefix)} onClick={goSection}>
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
  );
}

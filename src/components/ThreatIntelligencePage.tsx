import { navigateTo } from "../navigate";
import { LandingFooter, LandingNav } from "./LandingChrome";
import { PublicDashboard } from "./PublicDashboard";

export function ThreatIntelligencePage() {
  return (
    <div className="lp threat-page">
      <LandingNav />
      <main className="threat-main">
        <PublicDashboard onGetApi={() => navigateTo("/register")} />
      </main>
      <LandingFooter hashPrefix="/landing-page" />
    </div>
  );
}

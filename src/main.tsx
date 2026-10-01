import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LandingPage } from "./components/LandingPage";
import { RegisterPage } from "./components/RegisterPage";
import { FaqsPage } from "./components/FaqsPage";
import { SignInPage } from "./components/SignInPage";
import { ThreatIntelligencePage } from "./components/ThreatIntelligencePage";
import { DevToolsPanel, DevToolsProvider } from "./devtools";
import { publicRoute } from "./navigate";
import "./index.css";
import "./landing.css";

function Root() {
  const [route, setRoute] = useState(publicRoute);

  useEffect(() => {
    function syncRoute() {
      setRoute(publicRoute());
    }

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  if (route === "landing") {
    return <LandingPage />;
  }

  if (route === "register") {
    return <RegisterPage />;
  }

  if (route === "threat") {
    return <ThreatIntelligencePage />;
  }

  if (route === "faqs") {
    return <FaqsPage />;
  }

  if (route === "sign-in") {
    return <SignInPage />;
  }

  if (import.meta.env.DEV) {
    return (
      <DevToolsProvider>
        <App />
        <DevToolsPanel />
      </DevToolsProvider>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

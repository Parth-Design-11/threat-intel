import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LandingPage } from "./components/LandingPage";
import { DevToolsPanel, DevToolsProvider } from "./devtools";
import { isLandingPath } from "./navigate";
import "./index.css";
import "./landing.css";

function Root() {
  const [landing, setLanding] = useState(isLandingPath);

  useEffect(() => {
    function syncRoute() {
      setLanding(isLandingPath());
    }

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  if (landing) {
    return <LandingPage />;
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

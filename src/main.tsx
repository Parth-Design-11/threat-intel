import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LandingPage } from "./components/LandingPage";
import { DevToolsPanel, DevToolsProvider } from "./devtools";
import "./index.css";
import "./landing.css";

function isLandingRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path === "/landing-page" || path.endsWith("/landing-page");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isLandingRoute() ? (
      <LandingPage />
    ) : import.meta.env.DEV ? (
      <DevToolsProvider>
        <App />
        <DevToolsPanel />
      </DevToolsProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
);

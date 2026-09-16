import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { DevToolsPanel, DevToolsProvider } from "./devtools";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {import.meta.env.DEV ? (
      <DevToolsProvider>
        <App />
        <DevToolsPanel />
      </DevToolsProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
);

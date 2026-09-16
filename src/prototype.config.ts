export type StatusControl = {
  kind: "status";
  id: string;
  label: string;
  screen?: string;
  values: readonly string[];
};

export type PersonaControl = {
  kind: "persona";
  id: string;
  label: string;
  screen?: string;
  values: readonly string[];
  fallback: string;
};

export type FlowControl = {
  kind: "flow";
  id: string;
  label: string;
  screen?: string;
  steps: readonly string[];
};

export type DatasetControl = {
  kind: "dataset";
  id: string;
  label: string;
  screen?: string;
  values: readonly string[];
  fallback: string;
};

export type FlagControl = {
  kind: "flag";
  id: string;
  label: string;
  screen?: string;
};

export type ChoiceControl = {
  kind: "choice";
  id: string;
  label: string;
  screen?: string;
  values: readonly string[];
  fallback?: string;
};

export type PrototypeControl =
  | StatusControl
  | PersonaControl
  | FlowControl
  | DatasetControl
  | FlagControl
  | ChoiceControl;

export type PrototypeScenario = {
  id: string;
  label: string;
  set: Record<string, string>;
};

export type PrototypeConfig = {
  controls: readonly PrototypeControl[];
  scenarios: readonly PrototypeScenario[];
};

export const prototypeConfig: PrototypeConfig = {
  controls: [
    {
      kind: "flow",
      id: "app.section",
      label: "Section",
      steps: ["dashboard", "explore", "api", "settings"],
    },
    {
      kind: "status",
      id: "explore.aParty",
      label: "A-Party result",
      screen: "explore",
      values: ["full", "zero", "no-evidence"],
    },
    {
      kind: "choice",
      id: "explore.aParty.layout",
      label: "A-Party layout",
      screen: "explore",
      values: ["current", "profile"],
      fallback: "profile",
    },
    {
      kind: "status",
      id: "explore.cta",
      label: "CTA result",
      screen: "explore",
      values: ["full", "zero", "no-evidence"],
    },
    {
      kind: "choice",
      id: "api.tab",
      label: "API tab",
      screen: "api",
      values: ["keys", "usage", "playground"],
    },
    {
      kind: "dataset",
      id: "api.keys",
      label: "API keys",
      screen: "api",
      values: ["none", "typical"],
      fallback: "typical",
    },
  ],
  scenarios: [
    {
      id: "a-party-empty",
      label: "A-Party: no intelligence",
      set: { "app.section": "explore", "explore.aParty": "zero" },
    },
    {
      id: "a-party-no-evidence",
      label: "A-Party: no evidence",
      set: { "app.section": "explore", "explore.aParty": "no-evidence" },
    },
    {
      id: "a-party-hit",
      label: "A-Party: high-risk hit",
      set: { "app.section": "explore", "explore.aParty": "full", "explore.aParty.layout": "current" },
    },
    {
      id: "a-party-profile",
      label: "A-Party: profile layout",
      set: { "app.section": "explore", "explore.aParty": "full", "explore.aParty.layout": "profile" },
    },
    {
      id: "cta-empty",
      label: "CTA: no intelligence",
      set: { "app.section": "explore", "explore.cta": "zero" },
    },
    {
      id: "api-empty",
      label: "Empty API catalog",
      set: { "app.section": "api", "api.tab": "keys", "api.keys": "none" },
    },
  ],
} as const;

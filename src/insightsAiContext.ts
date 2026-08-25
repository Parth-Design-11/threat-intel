export type InsightsWidgetId =
  | "users-protected"
  | "smishing-attacks"
  | "impersonations-blocked"
  | "customer-complaints"
  | "protection-trend"
  | "channel-split"
  | "landscape-users"
  | "landscape-modus"
  | "landscape-scammer"
  | "targeted-circles"
  | "use-case-mix"
  | "top-patterns"
  | "cta-intelligence";

export type InsightsWidgetContext = {
  id: InsightsWidgetId;
  title: string;
  summary: string;
  suggestedQuestions: string[];
};

export const INSIGHTS_WIDGET_CONTEXT: Record<InsightsWidgetId, InsightsWidgetContext> = {
  "users-protected": {
    id: "users-protected",
    title: "Users Protected",
    summary: "6.2M users protected in July 2026, up 45% vs June. Peak day 15 Jul at 1.7× daily average.",
    suggestedQuestions: [
      "Why did protected users jump 45% in July?",
      "Which circles drove the 15 July spike?",
      "Are repeat victims included in this count?",
    ],
  },
  "smishing-attacks": {
    id: "smishing-attacks",
    title: "Smishing Attacks",
    summary: "18.8M scam messages in July — A2P +77% and P2P +133% month over month.",
    suggestedQuestions: [
      "Why is P2P growing faster than A2P?",
      "What changed between June and July?",
      "How does this compare to April levels?",
    ],
  },
  "impersonations-blocked": {
    id: "impersonations-blocked",
    title: "Impersonations Blocked",
    summary: "0 impersonating URLs or sender IDs in July. Flat month over month.",
    suggestedQuestions: [
      "How are impersonations being eliminated?",
      "Were any near-misses flagged internally?",
      "What monitoring covers sender ID spoofing?",
    ],
  },
  "customer-complaints": {
    id: "customer-complaints",
    title: "Customer Complaints",
    summary: "0 customer complaints in July, down from 192 in April.",
    suggestedQuestions: [
      "What drove complaints down from 192 in April?",
      "Is zero complaints sustainable?",
      "How does complaint volume correlate with attack volume?",
    ],
  },
  "protection-trend": {
    id: "protection-trend",
    title: "Protection trend · Feb–Jul 2026",
    summary: "A2P and P2P scam traffic both rising through Jul. 15 Jul spike ~2× daily July average.",
    suggestedQuestions: [
      "Explain the 15 July spike in context",
      "When did P2P overtake A2P as the dominant channel?",
      "Forecast August volume from this trend",
    ],
  },
  "channel-split": {
    id: "channel-split",
    title: "Channel split",
    summary: "18.8M total scams — 27% A2P (5.1M), 73% P2P (13.7M). 3.0 attacks per protected user.",
    suggestedQuestions: [
      "Why is P2P 73% of scam volume?",
      "What is the A2P vs P2P risk profile?",
      "How many users per unique scammer?",
    ],
  },
  "landscape-users": {
    id: "landscape-users",
    title: "Users landscape",
    summary: "3.0M net new victims (+94% vs Jun). 1.4M repeat victims Apr–Jul.",
    suggestedQuestions: [
      "Who are the repeat victims?",
      "What caused 94% growth in new victims?",
      "How does peak day compare to monthly average?",
    ],
  },
  "landscape-modus": {
    id: "landscape-modus",
    title: "Modus operandi",
    summary: "Gambling dominates at 93%. URL CTAs 90–95%. 20K–25K distinct URLs per day.",
    suggestedQuestions: [
      "Why is gambling the top use case?",
      "How fast do CTA URLs rotate?",
      "What attack types beyond gambling exist?",
    ],
  },
  "landscape-scammer": {
    id: "landscape-scammer",
    title: "Scammer concentration",
    summary: "246.8K unique senders. Top 1% account for 93% of attacks. 113.8K net new scammers.",
    suggestedQuestions: [
      "Can we profile the top 1% of scammers?",
      "How many are repeat vs net new?",
      "What blocking strategy targets high-volume senders?",
    ],
  },
  "targeted-circles": {
    id: "targeted-circles",
    title: "Top targeted circles",
    summary: "Gujarat leads at 10% share. UP, Bihar, MP at 8%. Rajasthan at 7%.",
    suggestedQuestions: [
      "Why is Gujarat the most targeted circle?",
      "Which circles grew fastest MoM?",
      "Should we prioritize Gujarat for outreach?",
    ],
  },
  "use-case-mix": {
    id: "use-case-mix",
    title: "Use case mix · A2P vs P2P",
    summary: "Gambling ~93% in both channels. Investment and fake loan are minor but rising in P2P.",
    suggestedQuestions: [
      "How does gambling differ between A2P and P2P?",
      "Are investment scams increasing?",
      "Which use case has highest user impact?",
    ],
  },
  "top-patterns": {
    id: "top-patterns",
    title: "Top scam patterns",
    summary: "Matka/gambling URLs dominate. Top pattern: 557K volume, 8.6% of scams, 136K users.",
    suggestedQuestions: [
      "Break down the top matka pattern",
      "How many users saw multiple patterns?",
      "Which patterns should we block proactively?",
    ],
  },
  "cta-intelligence": {
    id: "cta-intelligence",
    title: "CTA intelligence",
    summary: "90–95% URL CTAs. 20K–25K distinct URLs/day. High daily decay — most URLs live <24h.",
    suggestedQuestions: [
      "Why do CTAs rotate so quickly?",
      "How effective is proactive URL blocking?",
      "What non-SMS CTA channels exist?",
    ],
  },
};

const RESPONSES: Partial<Record<InsightsWidgetId, Record<string, string>>> = {
  "users-protected": {
    default:
      "July protection covered **6.2M users** (+45% vs June). The **15 July spike** drove ~1.7× the daily average — likely coordinated gambling campaign bursts in Gujarat and UP circles. Repeat victims (1.4M Apr–Jul) suggest re-targeting of previously exposed numbers.",
    spike: "The 15 Jul spike aligns with a matka URL campaign (`khatri555.com` family) that peaked at ~2× July daily scam traffic. Most affected circles: Gujarat, UP, Bihar.",
  },
  "smishing-attacks": {
    default:
      "**18.8M** scam messages in July. **P2P grew +133%** vs **A2P +77%** — scammers are shifting to peer sends to bypass A2P filtering. P2P now represents 73% of volume. Recommend tightening P2P heuristics for gambling keywords.",
    p2p: "P2P acceleration likely reflects scammers using personal SIMs after A2P template scrutiny increased. Top P2P patterns mirror A2P gambling CTAs but with shorter URL lifetimes.",
  },
  "targeted-circles": {
    default:
      "**Gujarat (10%)** leads attack share — high mobile penetration and active gambling affiliate networks. **Bihar (+2pp MoM)** is the fastest riser. Geographic concentration suggests circle-level proactive blocking could reduce volume 15–20%.",
  },
  "top-patterns": {
    default:
      "The **khatri555.com** matka pattern alone accounts for **8.6%** of all July scams (557K messages, 136K users). Festive-reward variants (`radha567.com`) target overlapping user sets. Recommend domain-family blocking rather than single-URL takedown.",
  },
};

export function buildAgentSteps(widgetId: InsightsWidgetId, question: string): string[] {
  const context = INSIGHTS_WIDGET_CONTEXT[widgetId];
  const lower = question.toLowerCase();

  const steps = [`Reading ${context.title} data`, "Querying July 2026 dataset"];

  if (lower.includes("circle") || lower.includes("gujarat") || lower.includes("geograph")) {
    steps.push("Cross-referencing circle-level breakdown");
  }
  if (lower.includes("p2p") || lower.includes("a2p") || lower.includes("channel")) {
    steps.push("Splitting A2P vs P2P channels");
  }
  if (lower.includes("pattern") || lower.includes("url") || lower.includes("cta")) {
    steps.push("Scanning top scam patterns and CTA registry");
  }
  if (lower.includes("trend") || lower.includes("forecast") || lower.includes("spike")) {
    steps.push("Analyzing Feb–Jul trend series");
  }

  steps.push("Synthesizing analyst brief");
  return steps;
}

export function buildMockResponse(widgetId: InsightsWidgetId, question: string): string {
  const context = INSIGHTS_WIDGET_CONTEXT[widgetId];
  const lower = question.toLowerCase();
  const widgetResponses = RESPONSES[widgetId];

  if (widgetResponses) {
    if (lower.includes("spike") || lower.includes("15 jul") || lower.includes("15 july")) {
      return widgetResponses.spike ?? widgetResponses.default ?? context.summary;
    }
    if (lower.includes("p2p") && widgetResponses.p2p) {
      return widgetResponses.p2p;
    }
    if (widgetResponses.default) {
      return widgetResponses.default;
    }
  }

  return `Based on **${context.title}** for July 2026: ${context.summary}\n\nFor "${question}" — I'd cross-reference this widget with channel split and circle data. The key signal is ${context.summary.split(".")[0]}. Want me to drill into a specific dimension (circles, patterns, or time series)?`;
}

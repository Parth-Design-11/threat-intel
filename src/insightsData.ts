export const INSIGHTS_PERIODS = ["July 2026", "June 2026", "May 2026"] as const;

export type InsightsPeriod = (typeof INSIGHTS_PERIODS)[number];

export const INSIGHTS_SUMMARY = {
  tenant: "ICICI Bank",
  subtitle: "SMS phishing protection overview",
  usersProtected: "6.2M",
  usersProtectedDelta: "45% vs Jun",
  smishingAttacks: "18.8M",
  channelDelta: "A2P +77% · P2P +133%",
  impersonationsBlocked: "0",
  impersonationsDelta: "MoM flat",
  customerComplaints: "0",
  complaintsDelta: "from 192 in Apr",
};

export const TREND_MONTHS = [
  { label: "Feb", a2p: 34, p2p: 52 },
  { label: "Mar", a2p: 38, p2p: 58 },
  { label: "Apr", a2p: 42, p2p: 62 },
  { label: "May", a2p: 46, p2p: 68 },
  { label: "Jun", a2p: 48, p2p: 74 },
  { label: "Jul", a2p: 54, p2p: 88 },
];

export const CHANNEL_SPLIT = {
  total: "18.8M",
  a2p: "5.1M (27%)",
  p2p: "13.7M (73%)",
  usersProtected: "6.2M",
  attacksPerUser: "3.0",
  usersPerScammer: "25.2",
};

export const LANDSCAPE_CARDS = [
  {
    title: "Users",
    rows: [
      ["Net new victims", "3.0M"],
      ["Change vs Jun", "+94%"],
      ["Repeat victims (Apr–Jul)", "1.4M"],
      ["Peak day (15 Jul)", "1.7× daily avg"],
    ],
  },
  {
    title: "Modus operandi",
    rows: [
      ["Top use case", "Gambling (93%)"],
      ["CTA type", "URLs (90–95%)"],
      ["Distinct URLs / day", "20K–25K"],
      ["Attack types observed", "10+"],
    ],
  },
  {
    title: "Scammer concentration",
    rows: [
      ["Unique senders", "246.8K"],
      ["Top 1% share of attacks", "93%"],
      ["Net new scammers", "113.8K"],
      ["Repeat scammers (Apr–Jul)", "130K"],
    ],
  },
] as const;

export type CircleTarget = {
  circle: string;
  stateId: string;
  share: string;
  shareNum: number;
  mom: string;
};

export const TOP_CIRCLES: CircleTarget[] = [
  { circle: "Gujarat", stateId: "INGJ", share: "10%", shareNum: 10, mom: "+1pp" },
  { circle: "Uttar Pradesh", stateId: "INUP", share: "8%", shareNum: 8, mom: "+1pp" },
  { circle: "Bihar", stateId: "INBR", share: "8%", shareNum: 8, mom: "+2pp" },
  { circle: "Rajasthan", stateId: "INRJ", share: "7%", shareNum: 7, mom: "—" },
  { circle: "Madhya Pradesh", stateId: "INMP", share: "8%", shareNum: 8, mom: "+1pp" },
];

export const SCAMMER_CIRCLES: CircleTarget[] = [
  { circle: "Maharashtra", stateId: "INMH", share: "18%", shareNum: 18, mom: "+3pp" },
  { circle: "Delhi", stateId: "INDL", share: "14%", shareNum: 14, mom: "+2pp" },
  { circle: "Telangana", stateId: "INTG", share: "12%", shareNum: 12, mom: "+1pp" },
  { circle: "Karnataka", stateId: "INKA", share: "9%", shareNum: 9, mom: "—" },
  { circle: "West Bengal", stateId: "INWB", share: "8%", shareNum: 8, mom: "+1pp" },
];

export const USE_CASES = [
  { label: "Gambling", detail: "92% A2P · 93% P2P", width: 93 },
  { label: "Investment / business", detail: "1% A2P · 4% P2P", width: 18, muted: true },
  { label: "Fake loan", detail: "3% A2P · 1% P2P", width: 10, muted: true },
  { label: "Dating / job / other", detail: "4% combined", width: 8, muted: true },
];

export const TOP_PATTERNS = [
  {
    id: "p1",
    excerpt:
      "NEW UPDATE https://khatri555.com/ FULL RATE MATKA APP SINGLE 1 KA 10 JODI 1 KA 100 PANA…",
    volume: "557,462",
    share: "8.6%",
    users: "136,458",
  },
  {
    id: "p2",
    excerpt:
      "This festive occasion, may success come into your life. happiness your family. https://radha567.com/ALEEFBAY",
    volume: "141,332",
    share: "0.8%",
    users: "135,548",
  },
  {
    id: "p3",
    excerpt:
      "Claim Special Reward! Rs.50000 Welcome Bonus. Prize Pool Bigger than ever. Play Now at Khel222! @ bit.ly/K2-nd",
    volume: "111,232",
    share: "0.6%",
    users: "55,550",
  },
];

export const CTA_CHIPS = [
  { label: "90–95%", text: "URL CTAs" },
  { label: "20K–25K", text: "distinct URLs / day" },
  { label: "<1%", text: "WhatsApp / email" },
  { label: "High", text: "daily CTA decay" },
];

export const CTA_SPARKLINE = [28, 32, 36, 40, 44, 48, 52, 58, 64, 72, 80, 88];

export type InsightCopyPart = {
  text: string;
  weight?: "regular" | "semibold";
};

export const AI_INSIGHTS = {
  title: "Top Insights",
  lead: "Threat activity on the network has reduced by 12% in the current week",
  cards: [
    {
      title: "Peak Scam Hour",
      parts: [
        { text: "In the last 7 days, the highest volume of scam messages was sent at " },
        { text: "19:00 (7 PM), ", weight: "semibold" },
        { text: "totalling" },
        { text: " 5,084,167", weight: "semibold" },
        { text: " messages." },
      ],
    },
    {
      title: "Top Scam Province",
      parts: [
        { text: "In the last 7 days, scammers were most active in JAWA TENGAH, with " },
        { text: "8,382,403", weight: "semibold" },
        { text: " recorded scam activities." },
      ],
    },
    {
      title: "Net New Scammers",
      parts: [
        { text: "49,974", weight: "semibold" },
        { text: " net new scammers were identified in the last 7 days." },
      ],
    },
    {
      title: "Top Active Scammer Operator",
      parts: [
        { text: "Telkomsel", weight: "semibold" },
        { text: " has the highest number of active scammer users in the last 7 days, with " },
        { text: "1,279,988", weight: "semibold" },
        { text: " active scammers." },
      ],
    },
    {
      title: "Top Scam SMS OEM",
      parts: [
        { text: "Quectel devices ", weight: "semibold" },
        { text: "sent the most scam SMS in the last 7 days, totaling" },
        { text: " 7,610,240 messages.", weight: "semibold" },
      ],
    },
  ],
} as const;

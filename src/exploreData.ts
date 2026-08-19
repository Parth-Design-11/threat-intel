export type EvidenceConfidence = "LOW" | "MEDIUM" | "HIGH";

export type EvidenceRow = {
  id: string;
  template: string;
  cta: string;
  confidence: EvidenceConfidence;
  attackCounts: string;
  usersAffected: string;
  firstObserved: string;
  lastObserved: string;
  channel: string;
  useCase: string;
};

export type RelatedAsset = {
  id: string;
  value: string;
  kind: "URL" | "Message Pattern" | "Sender";
  reportedBy: string;
};

export function maskIdentifier(value: string) {
  const compact = value.replace(/\s/g, "");
  if (compact.length <= 8) return compact;
  const head = compact.slice(0, 5);
  const tail = compact.slice(-2);
  return `${head}${"*".repeat(7)}${tail}`;
}

export function displayQuery(value: string) {
  const compact = value.trim();
  if (compact.startsWith("+") || compact.includes("@")) return maskIdentifier(compact);
  if (compact.length > 56) return `${compact.slice(0, 56)}…`;
  return compact;
}

export const A_PARTY_DETAILS = {
  originTelecom: "Indosat",
  assetType: "Sender",
  identifiedOn: "Apr 30, 2026 7:00 AM",
  ctasUsed: "40",
  evidences: "54",
  totalAttackCounts: "30,938",
  firstObserved: "Jun 22, 2026",
  lastObserved: "Jul 25, 2026",
};

export const A_PARTY_EVIDENCES: EvidenceRow[] = [
  {
    id: "1",
    template: "Kesempatan emas klaim saldo Anda sekarang",
    cta: "https://ma.ly/claim-saldo",
    confidence: "MEDIUM",
    attackCounts: "8,422",
    usersAffected: "8,354",
    firstObserved: "Jul 12, 2026",
    lastObserved: "Jul 25, 2026",
    channel: "SMS",
    useCase: "Other",
  },
  {
    id: "2",
    template: "Bergabung sekarang dan dapatkan bonus",
    cta: "https://ma.ly/join-bonus",
    confidence: "MEDIUM",
    attackCounts: "6,160",
    usersAffected: "6,134",
    firstObserved: "Jul 9, 2026",
    lastObserved: "Jul 22, 2026",
    channel: "SMS",
    useCase: "Other",
  },
  {
    id: "3",
    template: "Segera verifikasi akun Anda sebelum diblokir",
    cta: "https://s.id/verify-now",
    confidence: "MEDIUM",
    attackCounts: "4,890",
    usersAffected: "4,812",
    firstObserved: "Jul 5, 2026",
    lastObserved: "Jul 20, 2026",
    channel: "SMS",
    useCase: "Other",
  },
  {
    id: "4",
    template: "Klaim hadiah Anda sebelum midnight",
    cta: "https://bit.ly/hadiah-id",
    confidence: "HIGH",
    attackCounts: "3,201",
    usersAffected: "3,144",
    firstObserved: "Jun 28, 2026",
    lastObserved: "Jul 18, 2026",
    channel: "SMS",
    useCase: "Other",
  },
  {
    id: "5",
    template: "Pembaruan data KYC diperlukan hari ini",
    cta: "https://lin.ee/kyc-update",
    confidence: "MEDIUM",
    attackCounts: "2,774",
    usersAffected: "2,701",
    firstObserved: "Jun 22, 2026",
    lastObserved: "Jul 15, 2026",
    channel: "SMS",
    useCase: "Other",
  },
  {
    id: "6",
    template: "Akun terblokir, tap tautan untuk buka",
    cta: "https://rebrand.ly/unlock",
    confidence: "HIGH",
    attackCounts: "2,110",
    usersAffected: "2,088",
    firstObserved: "Jun 18, 2026",
    lastObserved: "Jul 12, 2026",
    channel: "WhatsApp",
    useCase: "Other",
  },
  {
    id: "7",
    template: "Transfer dana gagal, coba lagi di sini",
    cta: "https://goo.gl/tf-retry",
    confidence: "LOW",
    attackCounts: "1,642",
    usersAffected: "1,590",
    firstObserved: "Jun 10, 2026",
    lastObserved: "Jul 8, 2026",
    channel: "SMS",
    useCase: "Other",
  },
];

export const A_PARTY_RELATED: RelatedAsset[] = [
  { id: "r1", value: "http://shorturl.at/JiVPC?g5FX", kind: "URL", reportedBy: "Telco" },
  { id: "r2", value: "http://shorturl.at/nK8mQ?p2LT", kind: "URL", reportedBy: "Telco" },
  { id: "r3", value: "https://s.id/verify-akun-88", kind: "URL", reportedBy: "Telco" },
  { id: "r4", value: "https://bit.ly/hadiah-id-2026", kind: "URL", reportedBy: "Telco" },
  { id: "r5", value: "http://shorturl.at/wR3cD?k9MN", kind: "URL", reportedBy: "Telco" },
  { id: "r6", value: "https://lin.ee/kyc-update-id", kind: "URL", reportedBy: "Telco" },
  { id: "r7", value: "http://tinyurl.com/unlock-id", kind: "URL", reportedBy: "Telco" },
  { id: "r8", value: "https://rebrand.ly/tf-retry", kind: "URL", reportedBy: "Telco" },
];

export const PATTERN_DETAILS = {
  assetType: "Message Pattern",
  identifiedOn: "Jul 12, 2026 9:14 AM",
  families: "vishing · investment · otp",
  relatedSenders: "6",
  totalAttackCounts: "12,481",
  channels: "SMS · WhatsApp",
  firstObserved: "May 3, 2026",
  lastObserved: "Jul 25, 2026",
  usersAffected: "9,204",
};

export type RelatedSender = {
  id: string;
  sender: string;
  telecom: string;
  confidence: EvidenceConfidence;
  attackCounts: string;
  usersAffected: string;
  firstObserved: string;
  lastObserved: string;
  channel: string;
  useCase: string;
};

export const PATTERN_SENDERS: RelatedSender[] = [
  {
    id: "1",
    sender: "+6285*******10",
    telecom: "Indosat",
    confidence: "HIGH",
    attackCounts: "4,210",
    usersAffected: "3,981",
    firstObserved: "Jul 8, 2026",
    lastObserved: "Jul 25, 2026",
    channel: "SMS",
    useCase: "Gambling",
  },
  {
    id: "2",
    sender: "+6281*******44",
    telecom: "Telkomsel",
    confidence: "HIGH",
    attackCounts: "3,102",
    usersAffected: "2,944",
    firstObserved: "Jun 28, 2026",
    lastObserved: "Jul 22, 2026",
    channel: "WhatsApp",
    useCase: "Fake Job Scam",
  },
  {
    id: "3",
    sender: "+6287*******21",
    telecom: "XL",
    confidence: "MEDIUM",
    attackCounts: "2,188",
    usersAffected: "2,041",
    firstObserved: "Jun 14, 2026",
    lastObserved: "Jul 18, 2026",
    channel: "SMS",
    useCase: "KYC",
  },
  {
    id: "4",
    sender: "+6289*******08",
    telecom: "Tri",
    confidence: "MEDIUM",
    attackCounts: "1,540",
    usersAffected: "1,488",
    firstObserved: "Jun 2, 2026",
    lastObserved: "Jul 12, 2026",
    channel: "SMS",
    useCase: "OTP",
  },
  {
    id: "5",
    sender: "+6288*******63",
    telecom: "Smartfren",
    confidence: "HIGH",
    attackCounts: "981",
    usersAffected: "902",
    firstObserved: "May 21, 2026",
    lastObserved: "Jul 9, 2026",
    channel: "WhatsApp",
    useCase: "Investment",
  },
  {
    id: "6",
    sender: "+6282*******77",
    telecom: "Indosat",
    confidence: "LOW",
    attackCounts: "460",
    usersAffected: "412",
    firstObserved: "May 3, 2026",
    lastObserved: "Jun 30, 2026",
    channel: "SMS",
    useCase: "Vishing",
  },
];

export const PATTERN_RELATED: RelatedAsset[] = [
  { id: "p1", value: "Weekend PARTY pecah. Top up sekarang…", kind: "Message Pattern", reportedBy: "Wisely AI" },
  { id: "p2", value: "http://shorturl.at/bonus100", kind: "URL", reportedBy: "Telco" },
  { id: "p3", value: "Lowongan kerja remote, gaji 15jt…", kind: "Message Pattern", reportedBy: "Wisely AI" },
  { id: "p4", value: "https://bit.ly/loker-remote-15jt", kind: "URL", reportedBy: "Telco" },
  { id: "p5", value: "KYC Anda kadaluarsa. Verifikasi sekarang…", kind: "Message Pattern", reportedBy: "Wisely AI" },
  { id: "p6", value: "https://s.id/kyc-verify-now", kind: "URL", reportedBy: "Telco" },
  { id: "p7", value: "Investasi crypto 1% per hari. Modal kembali…", kind: "Message Pattern", reportedBy: "Wisely AI" },
  { id: "p8", value: "http://tinyurl.com/crypto-daily", kind: "URL", reportedBy: "Telco" },
];

export const CTA_DETAILS = {
  assetType: "URL",
  identifiedOn: "Jul 18, 2026 11:02 AM",
  ctaType: "Verify account",
  urgency: "High",
  shortener: "bit.ly",
  relatedMessages: "7",
  totalAttackCounts: "18,642",
  channels: "SMS · WhatsApp · Email",
  firstObserved: "Apr 12, 2026",
  lastObserved: "Jul 25, 2026",
  usersAffected: "14,208",
};

export type RelatedMessage = {
  id: string;
  template: string;
  sender: string;
  confidence: EvidenceConfidence;
  attackCounts: string;
  usersAffected: string;
  firstObserved: string;
  lastObserved: string;
  channel: string;
  useCase: string;
};

export const CTA_MESSAGES: RelatedMessage[] = [
  {
    id: "1",
    template: "Your KYC is expired. Click to verify now before account suspension.",
    sender: "+6285*******10",
    confidence: "HIGH",
    attackCounts: "5,840",
    usersAffected: "5,612",
    firstObserved: "Jul 10, 2026",
    lastObserved: "Jul 25, 2026",
    channel: "SMS",
    useCase: "KYC",
  },
  {
    id: "2",
    template: "URGENT: Account verification required within 24 hours.",
    sender: "+6281*******44",
    confidence: "HIGH",
    attackCounts: "4,102",
    usersAffected: "3,981",
    firstObserved: "Jul 2, 2026",
    lastObserved: "Jul 22, 2026",
    channel: "WhatsApp",
    useCase: "Account verify",
  },
  {
    id: "3",
    template: "Bank account update pending. Complete verification immediately.",
    sender: "+6287*******21",
    confidence: "MEDIUM",
    attackCounts: "3,288",
    usersAffected: "3,104",
    firstObserved: "Jun 20, 2026",
    lastObserved: "Jul 18, 2026",
    channel: "SMS",
    useCase: "Banking",
  },
  {
    id: "4",
    template: "Security alert: verify identity to restore access.",
    sender: "+6289*******08",
    confidence: "MEDIUM",
    attackCounts: "2,540",
    usersAffected: "2,411",
    firstObserved: "Jun 8, 2026",
    lastObserved: "Jul 14, 2026",
    channel: "Email",
    useCase: "Phishing",
  },
  {
    id: "5",
    template: "Tap link to confirm your profile and avoid service interruption.",
    sender: "+6288*******63",
    confidence: "HIGH",
    attackCounts: "1,981",
    usersAffected: "1,902",
    firstObserved: "May 24, 2026",
    lastObserved: "Jul 9, 2026",
    channel: "WhatsApp",
    useCase: "Generic",
  },
  {
    id: "6",
    template: "Limited time: verify now to keep your wallet active.",
    sender: "+6282*******77",
    confidence: "LOW",
    attackCounts: "891",
    usersAffected: "812",
    firstObserved: "Apr 12, 2026",
    lastObserved: "Jun 30, 2026",
    channel: "SMS",
    useCase: "Wallet",
  },
];

export const CTA_RELATED: RelatedAsset[] = [
  { id: "c1", value: "+6285*******10", kind: "Sender", reportedBy: "Telco" },
  { id: "c2", value: "KYC Anda kadaluarsa. Verifikasi sekarang…", kind: "Message Pattern", reportedBy: "Wisely AI" },
  { id: "c3", value: "https://s.id/kyc-verify-now", kind: "URL", reportedBy: "Telco" },
  { id: "c4", value: "+6281*******44", kind: "Sender", reportedBy: "Telco" },
  { id: "c5", value: "Pembaruan data KYC diperlukan hari ini", kind: "Message Pattern", reportedBy: "Wisely AI" },
  { id: "c6", value: "https://lin.ee/kyc-update", kind: "URL", reportedBy: "Telco" },
  { id: "c7", value: "+6287*******21", kind: "Sender", reportedBy: "Telco" },
  { id: "c8", value: "https://rebrand.ly/unlock", kind: "URL", reportedBy: "Telco" },
];

import {
  getMessagePattern,
  MESSAGE_PATTERNS,
  maskIdentifier,
  resolveBPartyResultState,
  type MessagePattern,
} from "./exploreData";

export type EvidenceIdentifiedAs = "Clean" | "Spam" | "Scam";

export type EvidenceMessagePattern = {
  id: string;
  excerpt: string;
  families: string;
  useCase: string;
  channels: string;
  relatedSenders: string;
  totalAttackCounts: string;
  usersAffected: string;
  firstObserved: string;
  lastObserved: string;
  identifiedOn: string;
};

export type EvidenceCdrRow = {
  id: string;
  referenceId: string;
  sender: string;
  timestamp: string;
  timestampIso: string;
  identifiedAs: EvidenceIdentifiedAs;
  pattern: EvidenceMessagePattern;
};

const CLEAN_PATTERNS: EvidenceMessagePattern[] = [
  {
    id: "clean-otp",
    excerpt: "Your one-time password is ****. Do not share this code with anyone.",
    families: "transactional · otp",
    useCase: "Transactional",
    channels: "SMS",
    relatedSenders: "1",
    totalAttackCounts: "0",
    usersAffected: "1",
    firstObserved: "Oct 2, 2026",
    lastObserved: "Nov 6, 2026",
    identifiedOn: "Nov 6, 2026 2:22 PM",
  },
  {
    id: "clean-delivery",
    excerpt: "Your package is out for delivery today. Track status in the official app.",
    families: "logistics · notify",
    useCase: "Delivery",
    channels: "SMS",
    relatedSenders: "1",
    totalAttackCounts: "0",
    usersAffected: "1",
    firstObserved: "Sep 18, 2026",
    lastObserved: "Nov 5, 2026",
    identifiedOn: "Nov 5, 2026 9:08 PM",
  },
  {
    id: "clean-balance",
    excerpt: "Account alert: a debit of ₹*** was posted. Available balance updated.",
    families: "banking · notify",
    useCase: "Banking",
    channels: "SMS",
    relatedSenders: "1",
    totalAttackCounts: "0",
    usersAffected: "1",
    firstObserved: "Aug 30, 2026",
    lastObserved: "Nov 4, 2026",
    identifiedOn: "Nov 4, 2026 11:41 AM",
  },
];

function fromMessagePattern(pattern: MessagePattern): EvidenceMessagePattern {
  return {
    id: pattern.id,
    excerpt: pattern.excerpt,
    families: pattern.families,
    useCase: pattern.useCase,
    channels: pattern.channels,
    relatedSenders: pattern.relatedSenders,
    totalAttackCounts: pattern.totalAttackCounts,
    usersAffected: pattern.usersAffected,
    firstObserved: pattern.firstObserved,
    lastObserved: pattern.lastObserved,
    identifiedOn: pattern.identifiedOn,
  };
}

/** Full Explore pattern (senders + related assets) when the CDR maps to a known scam pattern. */
export function resolveEvidencePatternDetail(patternId: string) {
  return getMessagePattern(patternId) ?? null;
}

export type EvidenceMetrics = {
  totalMessages: string;
  spamMessages: string;
  scamMessages: string;
};

export type EvidenceDatePreset = "7" | "30" | "60" | "custom";

function hashSeed(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function unit(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function maskSender(digits: string, index: number) {
  const tail = String((Number(digits.slice(-4) || "1000") + index * 17) % 10000).padStart(4, "0");
  return `+91******${tail}`;
}

/** Anchor “today” for prototype date math. */
export const EVIDENCE_TODAY = new Date("2026-11-06T14:30:00");

export function rangeForPreset(preset: Exclude<EvidenceDatePreset, "custom">, end = EVIDENCE_TODAY) {
  const endDate = new Date(end);
  const startDate = new Date(end);
  const days = Number(preset);
  startDate.setDate(endDate.getDate() - (days - 1));
  return {
    start: toIsoDate(startDate),
    end: toIsoDate(endDate),
  };
}

export function resolveEvidenceMetrics(query: string): EvidenceMetrics {
  const seed = hashSeed(query.trim().toLowerCase());
  const total = 800 + Math.floor(unit(seed) * 4200);
  const spam = Math.floor(total * (0.12 + unit(seed + 3) * 0.28));
  const scam = Math.floor(spam * (0.35 + unit(seed + 7) * 0.4));
  return {
    totalMessages: total.toLocaleString(),
    spamMessages: spam.toLocaleString(),
    scamMessages: scam.toLocaleString(),
  };
}

function patternForRow(identifiedAs: EvidenceIdentifiedAs, seed: number, index: number): EvidenceMessagePattern {
  if (identifiedAs === "Clean") {
    return CLEAN_PATTERNS[Math.floor(unit(seed + index * 11) * CLEAN_PATTERNS.length)];
  }
  const pick = MESSAGE_PATTERNS[Math.floor(unit(seed + index * 23) * MESSAGE_PATTERNS.length)];
  return fromMessagePattern(pick);
}

/** Latest CDR rows spanning ~70 days so 7/30/60 filters have content. */
export function resolveEvidenceCdrLogs(query: string, count = 100): EvidenceCdrRow[] {
  const seed = hashSeed(query.trim().toLowerCase() || "evidence");
  const digits = query.replace(/\D/g, "") || "9876543210";
  const now = EVIDENCE_TODAY;
  return Array.from({ length: count }, (_, index) => {
    const roll = unit(seed + index * 19);
    const identifiedAs: EvidenceIdentifiedAs = roll > 0.82 ? "Scam" : roll > 0.55 ? "Spam" : "Clean";
    // Spread across ~70 days, newest first
    const minutesAgo = Math.floor((index / Math.max(count - 1, 1)) * 70 * 24 * 60) + Math.floor(unit(seed + index) * 40);
    const at = new Date(now.getTime() - minutesAgo * 60_000);
    const ref = `CDR-${String((seed + index * 997) % 1_000_000).padStart(6, "0")}`;
    return {
      id: `${seed}-${index}`,
      referenceId: ref,
      sender: maskSender(digits, index),
      timestamp: formatTimestamp(at),
      timestampIso: toIsoDate(at),
      identifiedAs,
      pattern: patternForRow(identifiedAs, seed, index),
    };
  });
}

export function filterEvidenceCdrLogs(
  rows: EvidenceCdrRow[],
  options: {
    range: { start: string; end: string };
    status: "all" | EvidenceIdentifiedAs;
    senderQuery: string;
  },
) {
  const senderNeedle = options.senderQuery.trim().toLowerCase();
  return rows.filter((row) => {
    if (row.timestampIso < options.range.start || row.timestampIso > options.range.end) return false;
    if (options.status !== "all" && row.identifiedAs !== options.status) return false;
    if (senderNeedle && !row.sender.toLowerCase().includes(senderNeedle)) return false;
    return true;
  });
}

export type EvidenceBatchStatus = "has-evidence" | "no-evidence";

export type EvidencePartyPair = {
  aParty: string;
  bParty: string;
};

/** Demo A-party / B-party pairs used by “Upload sample file and continue”. */
export const SAMPLE_EVIDENCE_PAIRS: EvidencePartyPair[] = [
  { aParty: "+6281234567890", bParty: "9876543210" },
  { aParty: "+6281987654321", bParty: "9123456780" },
  { aParty: "+919876543210", bParty: "9988776655" },
  { aParty: "+6281122334455", bParty: "9000000000" },
  { aParty: "+6285566778899", bParty: "9876501234" },
  { aParty: "+919900112233", bParty: "9999999999" },
  { aParty: "+6281345678901", bParty: "9812345678" },
  { aParty: "+6281765432109", bParty: "9765432109" },
];

export type EvidenceBatchRow = {
  id: string;
  aParty: string;
  bParty: string;
  aDisplay: string;
  bDisplay: string;
  status: EvidenceBatchStatus;
  messageCount: string;
  scamCount: string;
};

function normalizePhoneToken(value: string): string | null {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

/** Parse A-party / B-party pairs from CSV or TXT (two columns per row). */
export function parseEvidencePartyPairs(raw: string): EvidencePartyPair[] {
  const seen = new Set<string>();
  const pairs: EvidencePartyPair[] = [];
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const cells = trimmed.includes("\t")
      ? trimmed.split("\t")
      : trimmed.split(/[,;|]/).map((cell) => cell.trim());

    const cellA = cells[0] ?? "";
    const cellB = cells[1] ?? "";

    // Skip header rows
    if (
      cells.length >= 2 &&
      /a[\s_-]*party|sender|msisdn/i.test(cellA) &&
      /b[\s_-]*party|receiver|destination/i.test(cellB)
    ) {
      continue;
    }

    let aParty: string | null = null;
    let bParty: string | null = null;

    if (cells.length >= 2) {
      aParty = normalizePhoneToken(cellA);
      bParty = normalizePhoneToken(cellB);
    } else {
      const matches = trimmed.match(/(?:\+?\d[\d\s\-()]{6,}\d)/g) ?? [];
      const matchA = matches[0];
      const matchB = matches[1];
      if (matchA && matchB) {
        aParty = normalizePhoneToken(matchA);
        bParty = normalizePhoneToken(matchB);
      }
    }

    if (!aParty || !bParty || aParty === bParty) continue;
    const key = `${aParty}→${bParty}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push({ aParty, bParty });
  }

  return pairs;
}

export function pairHasEvidence(aParty: string, bParty: string): boolean {
  const state = resolveBPartyResultState(bParty);
  if (state === "zero" || state === "no-evidence") return false;
  return unit(hashSeed(`${aParty}|${bParty}`.toLowerCase())) > 0.28;
}

export function resolveEvidencePairMetrics(aParty: string, bParty: string): EvidenceMetrics {
  const seed = hashSeed(`${aParty}|${bParty}`.toLowerCase());
  const total = 12 + Math.floor(unit(seed) * 86);
  const spam = Math.floor(total * (0.18 + unit(seed + 3) * 0.35));
  const scam = Math.floor(spam * (0.35 + unit(seed + 7) * 0.45));
  return {
    totalMessages: total.toLocaleString(),
    spamMessages: spam.toLocaleString(),
    scamMessages: scam.toLocaleString(),
  };
}

export function resolveEvidenceBatch(pairs: EvidencePartyPair[]): EvidenceBatchRow[] {
  return pairs.map((pair, index) => {
    const hasEvidence = pairHasEvidence(pair.aParty, pair.bParty);
    const metrics = hasEvidence
      ? resolveEvidencePairMetrics(pair.aParty, pair.bParty)
      : { totalMessages: "0", spamMessages: "0", scamMessages: "0" };
    return {
      id: `batch-${index}-${pair.aParty}-${pair.bParty}`,
      aParty: pair.aParty,
      bParty: pair.bParty,
      aDisplay: maskIdentifier(pair.aParty),
      bDisplay: maskIdentifier(pair.bParty),
      status: hasEvidence ? "has-evidence" : "no-evidence",
      messageCount: metrics.totalMessages,
      scamCount: metrics.scamMessages,
    };
  });
}

/** CDR logs for one A-party → B-party combination only. */
export function resolveEvidencePairCdrLogs(
  aParty: string,
  bParty: string,
  count = 24,
): EvidenceCdrRow[] {
  const seed = hashSeed(`${aParty}|${bParty}`.toLowerCase() || "pair");
  const senderDisplay = maskIdentifier(aParty);
  const now = EVIDENCE_TODAY;
  const total = Math.max(6, Math.min(count, 12 + Math.floor(unit(seed) * (count - 6))));
  return Array.from({ length: total }, (_, index) => {
    const roll = unit(seed + index * 19);
    const identifiedAs: EvidenceIdentifiedAs = roll > 0.78 ? "Scam" : roll > 0.48 ? "Spam" : "Clean";
    const minutesAgo =
      Math.floor((index / Math.max(total - 1, 1)) * 45 * 24 * 60) + Math.floor(unit(seed + index) * 50);
    const at = new Date(now.getTime() - minutesAgo * 60_000);
    const ref = `CDR-${String((seed + index * 997) % 1_000_000).padStart(6, "0")}`;
    return {
      id: `${seed}-pair-${index}`,
      referenceId: ref,
      sender: senderDisplay,
      timestamp: formatTimestamp(at),
      timestampIso: toIsoDate(at),
      identifiedAs,
      pattern: patternForRow(identifiedAs, seed, index),
    };
  });
}

export type EvidenceIdentifiedAs = "Clean" | "Spam" | "Scam";

export type EvidenceCdrRow = {
  id: string;
  referenceId: string;
  sender: string;
  timestamp: string;
  timestampIso: string;
  identifiedAs: EvidenceIdentifiedAs;
};

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

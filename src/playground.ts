export const PLAYGROUND_TYPES = ["risk-score", "b-party", "cta", "pattern"] as const;
export type PlaygroundType = (typeof PLAYGROUND_TYPES)[number];

export const PLAYGROUND_TYPE_LABELS: Record<PlaygroundType, string> = {
  "risk-score": "A-Party Risk Score",
  "b-party": "B-Party Vulnerability",
  cta: "CTA Check",
  pattern: "Pattern Check",
};

const MAX_BYTES = 16 * 1024;
const IDENTIFIER_TYPES = ["phone", "email", "upi"] as const;
const PATTERN_INPUT_TYPES = ["phone", "email", "text"] as const;
const RISK_CHANNELS = ["voice", "sms", "whatsapp"] as const;
const CTA_CHANNELS = ["sms", "whatsapp", "email", "web"] as const;
const PATTERN_FAMILIES = ["vishing", "investment", "otp", "job", "kyc"] as const;
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly"];

type IdentifierType = (typeof IDENTIFIER_TYPES)[number];
type PatternInputType = (typeof PATTERN_INPUT_TYPES)[number];
type Identifier = { type: IdentifierType | PatternInputType; value: string };
type Detail = { path: string; code: string; message: string };

export type PlaygroundResult = {
  status: number;
  body: Record<string, unknown>;
};

type RunOptions = { now?: Date };

export const PLAYGROUND_EXAMPLES: Record<PlaygroundType, string> = {
  "risk-score": JSON.stringify(
    {
      identifier: { type: "phone", value: "+919876543210" },
      context: { channel: "voice", country: "IN" },
    },
    null,
    2,
  ),
  "b-party": JSON.stringify(
    {
      a_party: { type: "phone", value: "+919876543210" },
      b_party: { type: "phone", value: "+911140000000" },
      context: { channel: "voice", country: "IN" },
    },
    null,
    2,
  ),
  cta: JSON.stringify(
    {
      text: "Your KYC is expired. Click https://bit.ly/abc to verify now.",
      url: "https://bit.ly/abc",
      channel: "sms",
    },
    null,
    2,
  ),
  pattern: JSON.stringify(
    {
      input: { type: "phone", value: "+919876543210" },
      families: ["vishing", "investment"],
    },
    null,
    2,
  ),
};

export function runPlayground(
  type: PlaygroundType,
  raw: string,
  options: RunOptions = {},
): PlaygroundResult {
  const now = options.now ?? new Date();
  const bytes = new TextEncoder().encode(raw).length;
  if (bytes > MAX_BYTES) {
    return errorResult(413, "PAYLOAD_TOO_LARGE", "Request body exceeds 16KB.");
  }

  if (raw.trim() === "") {
    return errorResult(400, "INVALID_JSON", "Request body is empty.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return errorResult(400, "INVALID_JSON", "Request body is not valid JSON.");
  }

  if (!isPlainObject(parsed)) {
    return errorResult(400, "INVALID_TYPE", "Request body must be a JSON object.");
  }

  switch (type) {
    case "risk-score":
      return runRiskScore(parsed, now);
    case "b-party":
      return runBParty(parsed, now);
    case "cta":
      return runCta(parsed, now);
    case "pattern":
      return runPattern(parsed, now);
  }
}

function runRiskScore(body: Record<string, unknown>, now: Date): PlaygroundResult {
  const details: Detail[] = [];
  rejectUnknownKeys(body, ["identifier", "context"], details);
  const identifier = readIdentifier(body.identifier, "identifier", details, IDENTIFIER_TYPES);
  readContext(body.context, details, RISK_CHANNELS);

  const unsupported = details.find((d) => d.code === "UNSUPPORTED_IDENTIFIER");
  if (unsupported) {
    return errorResult(400, "UNSUPPORTED_IDENTIFIER", unsupported.message, [unsupported]);
  }
  if (details.length) {
    return validationError(details);
  }

  const score = scoreFrom(identifier!.value);
  const level = levelFrom(score);
  return {
    status: 200,
    body: {
      identifier,
      risk: { score, level, label: labelFrom(level, "risk") },
      signals: signalsFor(level, "risk"),
      checked_at: now.toISOString(),
    },
  };
}

function runBParty(body: Record<string, unknown>, now: Date): PlaygroundResult {
  const details: Detail[] = [];
  rejectUnknownKeys(body, ["a_party", "b_party", "context"], details);
  const aParty = readIdentifier(body.a_party, "a_party", details, IDENTIFIER_TYPES);
  const bParty = readIdentifier(body.b_party, "b_party", details, IDENTIFIER_TYPES);
  readContext(body.context, details, RISK_CHANNELS);

  const unsupported = details.find((d) => d.code === "UNSUPPORTED_IDENTIFIER");
  if (unsupported) {
    return errorResult(400, "UNSUPPORTED_IDENTIFIER", unsupported.message, [unsupported]);
  }
  if (details.length) {
    return validationError(details);
  }

  if (normalizeId(aParty!) === normalizeId(bParty!)) {
    return errorResult(
      422,
      "UNPROCESSABLE",
      "a_party and b_party must be different identifiers.",
    );
  }

  const score = scoreFrom(`${aParty!.value}|${bParty!.value}`);
  const level = levelFrom(score);
  return {
    status: 200,
    body: {
      a_party: aParty,
      b_party: bParty,
      vulnerability: { score, level, label: labelFrom(level, "vulnerability") },
      signals: signalsFor(level, "vulnerability"),
      checked_at: now.toISOString(),
    },
  };
}

function runCta(body: Record<string, unknown>, now: Date): PlaygroundResult {
  const details: Detail[] = [];
  rejectUnknownKeys(body, ["text", "url", "channel"], details);

  const hasText = Object.hasOwn(body, "text");
  const hasUrl = Object.hasOwn(body, "url");
  if (!hasText && !hasUrl) {
    return errorResult(422, "UNPROCESSABLE", "Provide at least one of text or url.");
  }

  let text: string | undefined;
  if (hasText) {
    text = readBoundedString(body.text, "text", details, 1, 5000);
  }
  let url: string | undefined;
  if (hasUrl) {
    url = readUrl(body.url, "url", details);
  }
  if (Object.hasOwn(body, "channel")) {
    readEnum(body.channel, "channel", details, CTA_CHANNELS);
  }

  if (details.length) {
    return validationError(details);
  }

  const haystack = `${text ?? ""} ${url ?? ""}`.toLowerCase();
  const detected = /click|verify|kyc|urgent|expired|otp|password|account|limited|immediately/.test(
    haystack,
  );
  const risky = Boolean(url && SHORTENERS.some((host) => url!.includes(host)));
  const ctaType = /kyc|verify|account/.test(haystack) ? "verify_account" : "generic";
  const urgency = /expired|urgent|immediately|kyc/.test(haystack) ? "high" : "medium";

  return {
    status: 200,
    body: {
      cta_detected: detected,
      cta: detected
        ? {
            type: ctaType,
            urgency,
            excerpt: (text ?? url ?? "").slice(0, 120),
          }
        : null,
      url: url
        ? {
            value: url,
            risky,
            reason: risky ? "shortener" : "none",
          }
        : null,
      checked_at: now.toISOString(),
    },
  };
}

function runPattern(body: Record<string, unknown>, now: Date): PlaygroundResult {
  const details: Detail[] = [];
  rejectUnknownKeys(body, ["input", "families"], details);
  const input = readIdentifier(body.input, "input", details, PATTERN_INPUT_TYPES);

  let families: string[] = [...PATTERN_FAMILIES];
  if (Object.hasOwn(body, "families")) {
    if (!Array.isArray(body.families)) {
      details.push({
        path: "families",
        code: "INVALID_TYPE",
        message: "families must be an array of strings.",
      });
    } else if (body.families.length === 0) {
      details.push({
        path: "families",
        code: "OUT_OF_RANGE",
        message: "families must contain at least one value.",
      });
    } else {
      const seen = new Set<string>();
      const parsed: string[] = [];
      body.families.forEach((item, index) => {
        if (typeof item !== "string") {
          details.push({
            path: `families[${index}]`,
            code: "INVALID_TYPE",
            message: "Each family must be a string.",
          });
          return;
        }
        if (!(PATTERN_FAMILIES as readonly string[]).includes(item)) {
          details.push({
            path: `families[${index}]`,
            code: "UNSUPPORTED_IDENTIFIER",
            message: `Unknown family '${item}'.`,
          });
          return;
        }
        if (seen.has(item)) {
          details.push({
            path: "families",
            code: "DUPLICATE",
            message: "families must not contain duplicates.",
          });
          return;
        }
        seen.add(item);
        parsed.push(item);
      });
      families = parsed;
    }
  }

  const unsupported = details.find((d) => d.code === "UNSUPPORTED_IDENTIFIER" && d.path === "input.type");
  if (unsupported) {
    return errorResult(400, "UNSUPPORTED_IDENTIFIER", unsupported.message, [unsupported]);
  }
  if (details.length) {
    return validationError(details);
  }

  const matches = families
    .filter((family) => scoreFrom(`${input!.value}:${family}`) >= 40)
    .map((family) => ({
      family,
      pattern_id: `ptn_${family}_${scoreFrom(family) % 10}`,
      confidence: Number(((scoreFrom(`${input!.value}:${family}`) % 50) / 100 + 0.5).toFixed(2)),
    }));

  return {
    status: 200,
    body: {
      input,
      matches,
      match_count: matches.length,
      checked_at: now.toISOString(),
    },
  };
}

function readIdentifier(
  value: unknown,
  path: string,
  details: Detail[],
  allowed: readonly string[],
): Identifier | null {
  if (value === undefined) {
    details.push({ path, code: "REQUIRED", message: `${path} is required.` });
    return null;
  }
  if (!isPlainObject(value)) {
    details.push({ path, code: "INVALID_TYPE", message: `${path} must be an object.` });
    return null;
  }
  rejectUnknownKeys(value, ["type", "value"], details, path);

  const type = value.type;
  if (type === undefined) {
    details.push({ path: `${path}.type`, code: "REQUIRED", message: `${path}.type is required.` });
  } else if (typeof type !== "string") {
    details.push({
      path: `${path}.type`,
      code: "INVALID_TYPE",
      message: `${path}.type must be a string.`,
    });
  } else if (!allowed.includes(type)) {
    details.push({
      path: `${path}.type`,
      code: "UNSUPPORTED_IDENTIFIER",
      message: `${path}.type '${type}' is not supported.`,
    });
  }

  const rawValue = value.value;
  if (rawValue === undefined) {
    details.push({ path: `${path}.value`, code: "REQUIRED", message: `${path}.value is required.` });
  } else if (typeof rawValue !== "string") {
    details.push({
      path: `${path}.value`,
      code: "INVALID_TYPE",
      message: `${path}.value must be a string.`,
    });
  } else if (typeof type === "string" && allowed.includes(type)) {
    const formatError = validateIdentifierValue(type, rawValue);
    if (formatError) {
      details.push({ path: `${path}.value`, code: "INVALID_FORMAT", message: formatError });
    }
  }

  if (details.some((d) => d.path.startsWith(path))) {
    return null;
  }
  return { type: type as Identifier["type"], value: rawValue as string };
}

function validateIdentifierValue(type: string, value: string): string | null {
  if (type === "phone") {
    return /^\+[1-9]\d{7,14}$/.test(value)
      ? null
      : "Phone must be E.164 (e.g. +919876543210).";
  }
  if (type === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Email is invalid.";
  }
  if (type === "upi") {
    return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,63}$/.test(value)
      ? null
      : "UPI id is invalid (e.g. name@okaxis).";
  }
  if (type === "text") {
    if (value.length < 1 || value.length > 5000) {
      return "text value must be between 1 and 5000 characters.";
    }
    return null;
  }
  return "Unsupported identifier type.";
}

function readContext(
  value: unknown,
  details: Detail[],
  channels: readonly string[],
): Record<string, string> | undefined {
  if (value === undefined) return undefined;
  if (!isPlainObject(value)) {
    details.push({ path: "context", code: "INVALID_TYPE", message: "context must be an object." });
    return undefined;
  }
  rejectUnknownKeys(value, ["channel", "country"], details, "context");
  if (Object.hasOwn(value, "channel")) {
    readEnum(value.channel, "context.channel", details, channels);
  }
  if (Object.hasOwn(value, "country")) {
    if (typeof value.country !== "string" || !/^[A-Z]{2}$/.test(value.country)) {
      details.push({
        path: "context.country",
        code: "INVALID_FORMAT",
        message: "country must be an ISO 3166-1 alpha-2 code.",
      });
    }
  }
  return value as Record<string, string>;
}

function readBoundedString(
  value: unknown,
  path: string,
  details: Detail[],
  min: number,
  max: number,
): string | undefined {
  if (typeof value !== "string") {
    details.push({ path, code: "INVALID_TYPE", message: `${path} must be a string.` });
    return undefined;
  }
  if (value.length < min || value.length > max) {
    details.push({
      path,
      code: "OUT_OF_RANGE",
      message: `${path} must be between ${min} and ${max} characters.`,
    });
    return undefined;
  }
  return value;
}

function readUrl(value: unknown, path: string, details: Detail[]): string | undefined {
  if (typeof value !== "string") {
    details.push({ path, code: "INVALID_TYPE", message: `${path} must be a string.` });
    return undefined;
  }
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      details.push({
        path,
        code: "INVALID_FORMAT",
        message: `${path} must be an http or https URL.`,
      });
      return undefined;
    }
    return value;
  } catch {
    details.push({ path, code: "INVALID_FORMAT", message: `${path} must be an http or https URL.` });
    return undefined;
  }
}

function readEnum(
  value: unknown,
  path: string,
  details: Detail[],
  allowed: readonly string[],
): string | undefined {
  if (typeof value !== "string") {
    details.push({ path, code: "INVALID_TYPE", message: `${path} must be a string.` });
    return undefined;
  }
  if (!allowed.includes(value)) {
    details.push({
      path,
      code: "INVALID_FORMAT",
      message: `${path} must be one of: ${allowed.join(", ")}.`,
    });
    return undefined;
  }
  return value;
}

function rejectUnknownKeys(
  value: Record<string, unknown>,
  allowed: string[],
  details: Detail[],
  prefix = "",
) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      const path = prefix ? `${prefix}.${key}` : key;
      details.push({ path, code: "UNKNOWN_KEY", message: `Unknown key '${path}'.` });
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeId(identifier: Identifier): string {
  return `${identifier.type}:${identifier.value.toLowerCase()}`;
}

function scoreFrom(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % 101;
}

function levelFrom(score: number): "low" | "medium" | "high" | "critical" {
  if (score <= 24) return "low";
  if (score <= 59) return "medium";
  if (score <= 84) return "high";
  return "critical";
}

function labelFrom(level: string, kind: "risk" | "vulnerability"): string {
  if (kind === "vulnerability") {
    if (level === "low") return "B-party looks ordinary";
    if (level === "medium") return "B-party has mixed exposure";
    if (level === "high") return "B-party is a known contact-center cluster";
    return "B-party is a high-risk cluster";
  }
  if (level === "low") return "Low risk";
  if (level === "medium") return "Elevated risk";
  if (level === "high") return "Likely scam";
  return "Confirmed high risk";
}

function signalsFor(level: string, kind: "risk" | "vulnerability") {
  if (kind === "vulnerability") {
    return level === "low"
      ? [{ code: "LOW_FAN_IN", weight: 0.12 }]
      : [{ code: "HIGH_FAN_IN", weight: 0.51 }];
  }
  if (level === "low") return [{ code: "CLEAN_HISTORY", weight: 0.11 }];
  return [
    { code: "REPORTED_SCAM", weight: 0.42 },
    { code: "NEW_NUMBER", weight: 0.18 },
  ];
}

function validationError(details: Detail[]): PlaygroundResult {
  return errorResult(400, "VALIDATION_ERROR", "Request is invalid.", uniqueDetails(details));
}

function errorResult(
  status: number,
  code: string,
  message: string,
  details?: Detail[],
): PlaygroundResult {
  return {
    status,
    body: {
      error: details?.length ? { code, message, details } : { code, message },
    },
  };
}

function uniqueDetails(details: Detail[]): Detail[] {
  const seen = new Set<string>();
  return details.filter((detail) => {
    const key = `${detail.path}:${detail.code}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

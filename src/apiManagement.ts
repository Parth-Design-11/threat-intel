export const API_TYPES = [
  "A-Party Risk Score",
  "B-Party Vulnerability",
  "CTA Check",
  "Message Pattern Check",
  "All APIs",
] as const;

export type ApiType = (typeof API_TYPES)[number];

export const ENVIRONMENTS = ["Production", "Staging", "Development"] as const;
export type ApiEnvironment = (typeof ENVIRONMENTS)[number];

export const EXPIRY_OPTIONS = [
  "30 days",
  "60 days",
  "90 days",
  "1 year",
  "Never",
] as const;
export type ExpiryOption = (typeof EXPIRY_OPTIONS)[number];

export type EndpointSpec = {
  path: string;
  method: "POST";
};

export const ENDPOINTS_BY_TYPE: Record<ApiType, EndpointSpec[]> = {
  "A-Party Risk Score": [{ path: "/v1/risk/a-party", method: "POST" }],
  "B-Party Vulnerability": [{ path: "/v1/risk/b-party", method: "POST" }],
  "CTA Check": [{ path: "/v1/check/cta", method: "POST" }],
  "Message Pattern Check": [{ path: "/v1/check/message-pattern", method: "POST" }],
  "All APIs": [
    { path: "/v1/risk/a-party", method: "POST" },
    { path: "/v1/risk/b-party", method: "POST" },
    { path: "/v1/check/cta", method: "POST" },
    { path: "/v1/check/message-pattern", method: "POST" },
  ],
};

const ENV_PREFIX: Record<ApiEnvironment, string> = {
  Production: "prod",
  Staging: "stg",
  Development: "dev",
};

export function buildKeyId(environment: ApiEnvironment, seed: string): string {
  const compact = seed.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suffix = (compact || "a4f2k9m2b8z1p5r0x7v9").slice(0, 20).padEnd(20, "0");
  return `ti_${ENV_PREFIX[environment]}_${suffix}`;
}

export function maskKeyId(keyId: string): string {
  if (keyId.length <= 10) return keyId;
  return `${keyId.slice(0, 12)}••••${keyId.slice(-4)}`;
}

export function resolveExpiryDate(option: ExpiryOption, now: Date): string {
  if (option === "Never") return "Never";

  const next = new Date(now);
  if (option === "30 days") next.setDate(next.getDate() + 30);
  if (option === "60 days") next.setDate(next.getDate() + 60);
  if (option === "90 days") next.setDate(next.getDate() + 90);
  if (option === "1 year") next.setFullYear(next.getFullYear() + 1);

  return next.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isExpiringSoon(expiry: string): boolean {
  if (expiry === "Never") return false;
  const target = new Date(expiry);
  if (Number.isNaN(target.getTime())) return false;
  const delta = target.getTime() - Date.now();
  return delta > 0 && delta <= 30 * 24 * 60 * 60 * 1000;
}

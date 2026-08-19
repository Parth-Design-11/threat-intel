import { describe, expect, it } from "vitest";
import { PLAYGROUND_TYPES, runPlayground } from "./playground";

const NOW = new Date("2026-08-17T08:43:00.000Z");

function run(type: (typeof PLAYGROUND_TYPES)[number], raw: string) {
  return runPlayground(type, raw, { now: NOW });
}

describe("runPlayground shared errors", () => {
  it("rejects an empty editor", () => {
    const result = run("risk-score", "");
    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      error: {
        code: "INVALID_JSON",
        message: "Request body is empty.",
      },
    });
  });

  it("rejects whitespace-only input", () => {
    const result = run("risk-score", "   \n\t  ");
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("INVALID_JSON");
  });

  it("rejects invalid JSON", () => {
    const result = run("risk-score", "{");
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("INVALID_JSON");
  });

  it("rejects a JSON array root", () => {
    const result = run("risk-score", "[]");
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("INVALID_TYPE");
  });

  it("rejects a JSON string root", () => {
    const result = run("cta", "\"hello\"");
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("INVALID_TYPE");
  });

  it("rejects payloads larger than 16KB", () => {
    const result = run("risk-score", `{${"\"a\":1,".repeat(4000)}"z":1}`);
    expect(result.status).toBe(413);
    expect(result.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });
});

describe("A-Party Risk Score", () => {
  const valid = {
    identifier: { type: "phone", value: "+919876543210" },
    context: { channel: "voice", country: "IN" },
  };

  it("returns a success payload for a valid phone identifier", () => {
    const result = run("risk-score", JSON.stringify(valid));
    expect(result.status).toBe(200);
    expect(result.body.identifier).toEqual(valid.identifier);
    expect(result.body.risk.score).toBeGreaterThanOrEqual(0);
    expect(result.body.risk.score).toBeLessThanOrEqual(100);
    expect(["low", "medium", "high", "critical"]).toContain(result.body.risk.level);
    expect(result.body.checked_at).toBe("2026-08-17T08:43:00.000Z");
    expect(Array.isArray(result.body.signals)).toBe(true);
  });

  it("is deterministic for the same identifier", () => {
    const a = run("risk-score", JSON.stringify(valid));
    const b = run("risk-score", JSON.stringify(valid));
    expect(a.body.risk).toEqual(b.body.risk);
  });

  it("collects multiple field errors on an empty object", () => {
    const result = run("risk-score", "{}");
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("VALIDATION_ERROR");
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "identifier", code: "REQUIRED" }),
      ]),
    );
  });

  it("rejects a missing identifier value", () => {
    const result = run("risk-score", JSON.stringify({ identifier: { type: "phone" } }));
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "identifier.value", code: "REQUIRED" }),
      ]),
    );
  });

  it("rejects a null identifier value", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ identifier: { type: "phone", value: null } }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "identifier.value", code: "INVALID_TYPE" }),
      ]),
    );
  });

  it("rejects an empty identifier value", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ identifier: { type: "phone", value: "" } }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "identifier.value", code: "INVALID_FORMAT" }),
      ]),
    );
  });

  it("rejects a numeric identifier value", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ identifier: { type: "phone", value: 919876543210 } }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "identifier.value", code: "INVALID_TYPE" }),
      ]),
    );
  });

  it("rejects a phone that is not E.164", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ identifier: { type: "phone", value: "9876543210" } }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "identifier.value", code: "INVALID_FORMAT" }),
      ]),
    );
  });

  it("rejects an unknown identifier type", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ identifier: { type: "Phone", value: "+919876543210" } }),
    );
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("UNSUPPORTED_IDENTIFIER");
  });

  it("rejects unknown top-level keys", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ ...valid, extra: true }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "extra", code: "UNKNOWN_KEY" }),
      ]),
    );
  });

  it("accepts a valid email identifier", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ identifier: { type: "email", value: "user@example.com" } }),
    );
    expect(result.status).toBe(200);
  });

  it("accepts a valid upi identifier", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ identifier: { type: "upi", value: "name@okaxis" } }),
    );
    expect(result.status).toBe(200);
  });
});

describe("B-Party Vulnerability", () => {
  const valid = {
    a_party: { type: "phone", value: "+919876543210" },
    b_party: { type: "phone", value: "+911140000000" },
  };

  it("returns a success payload for distinct parties", () => {
    const result = run("b-party", JSON.stringify(valid));
    expect(result.status).toBe(200);
    expect(result.body.a_party).toEqual(valid.a_party);
    expect(result.body.b_party).toEqual(valid.b_party);
    expect(result.body.vulnerability.score).toBeGreaterThanOrEqual(0);
  });

  it("rejects when a_party and b_party are the same", () => {
    const result = run(
      "b-party",
      JSON.stringify({
        a_party: { type: "phone", value: "+919876543210" },
        b_party: { type: "phone", value: "+919876543210" },
      }),
    );
    expect(result.status).toBe(422);
    expect(result.body.error.code).toBe("UNPROCESSABLE");
  });

  it("requires both parties", () => {
    const result = run("b-party", JSON.stringify({ a_party: valid.a_party }));
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "b_party", code: "REQUIRED" }),
      ]),
    );
  });
});

describe("CTA Check", () => {
  it("detects a CTA in message text", () => {
    const result = run(
      "cta",
      JSON.stringify({
        text: "Your KYC is expired. Click https://bit.ly/abc to verify now.",
        url: "https://bit.ly/abc",
        channel: "sms",
      }),
    );
    expect(result.status).toBe(200);
    expect(result.body.cta_detected).toBe(true);
    expect(result.body.cta.type).toBe("verify_account");
    expect(result.body.url.risky).toBe(true);
  });

  it("returns no CTA for a benign message", () => {
    const result = run(
      "cta",
      JSON.stringify({ text: "Dinner at 8, see you there." }),
    );
    expect(result.status).toBe(200);
    expect(result.body.cta_detected).toBe(false);
  });

  it("requires text or url", () => {
    const result = run("cta", "{}");
    expect(result.status).toBe(422);
    expect(result.body.error.code).toBe("UNPROCESSABLE");
  });

  it("rejects a javascript URL", () => {
    const result = run("cta", JSON.stringify({ url: "javascript:alert(1)" }));
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "url", code: "INVALID_FORMAT" }),
      ]),
    );
  });

  it("rejects text longer than 5000 characters", () => {
    const result = run("cta", JSON.stringify({ text: "a".repeat(5001) }));
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "text", code: "OUT_OF_RANGE" }),
      ]),
    );
  });
});

describe("Pattern Check", () => {
  it("returns matches for a valid phone input", () => {
    const result = run(
      "pattern",
      JSON.stringify({
        input: { type: "phone", value: "+919876543210" },
        families: ["vishing", "investment"],
      }),
    );
    expect(result.status).toBe(200);
    expect(result.body.match_count).toBe(result.body.matches.length);
  });

  it("rejects an empty families array", () => {
    const result = run(
      "pattern",
      JSON.stringify({
        input: { type: "phone", value: "+919876543210" },
        families: [],
      }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "families", code: "OUT_OF_RANGE" }),
      ]),
    );
  });

  it("rejects duplicate families", () => {
    const result = run(
      "pattern",
      JSON.stringify({
        input: { type: "phone", value: "+919876543210" },
        families: ["otp", "otp"],
      }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "families", code: "DUPLICATE" }),
      ]),
    );
  });

  it("rejects families as a string", () => {
    const result = run(
      "pattern",
      JSON.stringify({
        input: { type: "phone", value: "+919876543210" },
        families: "vishing",
      }),
    );
    expect(result.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "families", code: "INVALID_TYPE" }),
      ]),
    );
  });
});

describe("selected type isolation", () => {
  it("does not accept a CTA payload when Risk Score is selected", () => {
    const result = run(
      "risk-score",
      JSON.stringify({ text: "Click here to verify" }),
    );
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("VALIDATION_ERROR");
  });
});

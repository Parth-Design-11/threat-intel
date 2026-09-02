import { describe, expect, it } from "vitest";
import {
  ENDPOINTS_BY_TYPE,
  buildKeyId,
  maskKeyId,
  resolveExpiryDate,
} from "./apiManagement";

describe("apiManagement helpers", () => {
  it("maps all api types to the expected endpoints", () => {
    expect(ENDPOINTS_BY_TYPE["A-Party Risk Score"][0].path).toBe("/v1/risk/a-party");
    expect(ENDPOINTS_BY_TYPE["B-Party Vulnerability"][0].path).toBe("/v1/risk/b-party");
    expect(ENDPOINTS_BY_TYPE["CTA Check"][0].path).toBe("/v1/check/cta");
    expect(ENDPOINTS_BY_TYPE["Message Pattern Check"][0].path).toBe("/v1/check/message-pattern");
    expect(ENDPOINTS_BY_TYPE["All APIs"]).toHaveLength(4);
  });

  it("builds key ids from the name seed", () => {
    expect(buildKeyId("Prod API 123")).toBe("ti_prodapi1230000000000");
    expect(buildKeyId("Hello")).toBe("ti_hello000000000000000");
    expect(buildKeyId("")).toBe("ti_a4f2k9m2b8z1p5r0x7v9");
  });

  it("masks key ids for UI display", () => {
    expect(maskKeyId("ti_prod_a4f2k9m2b8z1p5r0x7v9")).toBe("ti_prod_a4f2••••x7v9");
  });

  it("resolves relative expiry options to an absolute date", () => {
    const now = new Date("2026-08-19T00:00:00.000Z");
    expect(resolveExpiryDate("30 days", now)).toMatch(/18 Sep 2026|18 Sept 2026/);
    expect(resolveExpiryDate("Never", now)).toBe("Never");
  });
});

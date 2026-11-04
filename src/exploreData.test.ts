import { describe, expect, it } from "vitest";
import { resolveBPartyResultState, resolvePhoneResultState } from "./exploreData";

describe("resolveBPartyResultState", () => {
  it("maps zero / no-evidence / full like phone Risk demos", () => {
    expect(resolveBPartyResultState("000")).toBe("zero");
    expect(resolveBPartyResultState("999")).toBe("no-evidence");
    expect(resolveBPartyResultState("+919876543210")).toBe("full");
    expect(resolveBPartyResultState("+919876543210:zero")).toBe("zero");
    expect(resolveBPartyResultState("+919876543210:no-evidence")).toBe("no-evidence");
  });

  it("stays aligned with resolvePhoneResultState conventions", () => {
    for (const query of ["000", "999", "+919876543210", "+919876543210:zero", "abc"]) {
      expect(resolveBPartyResultState(query)).toBe(resolvePhoneResultState(query));
    }
  });
});

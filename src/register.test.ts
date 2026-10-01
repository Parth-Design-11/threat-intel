import { describe, expect, it } from "vitest";
import { REASON_LIMIT, validateRegister, type RegisterInput } from "./register";

const valid: RegisterInput = {
  firstName: "Ada",
  lastName: "Lovelace",
  company: "Analytical Engines",
  jobTitle: "Analyst",
  phone: "81234567890",
  email: "ada@analytical.example",
  reason: "Need API access for threat lookups.",
};

describe("validateRegister", () => {
  it("accepts a complete business registration", () => {
    expect(validateRegister(valid)).toEqual({});
  });

  it("requires the contact fields", () => {
    expect(validateRegister({ ...valid, firstName: "  ", lastName: "", company: "", jobTitle: "", phone: "", email: "" })).toMatchObject({
      firstName: "Enter your first name.",
      lastName: "Enter your last name.",
      company: "Enter your company name.",
      jobTitle: "Enter your job title.",
      phone: "Enter your phone number.",
      email: "Enter your email.",
    });
  });

  it("rejects personal email providers", () => {
    expect(validateRegister({ ...valid, email: "ada@gmail.com" }).email).toMatch(/business email/i);
    expect(validateRegister({ ...valid, email: "ada@yahoo.co.id" }).email).toMatch(/business email/i);
    expect(validateRegister({ ...valid, email: "ada@hotmail.co.uk" }).email).toMatch(/business email/i);
  });

  it("rejects a malformed email before the business-domain check", () => {
    expect(validateRegister({ ...valid, email: "ada@" }).email).toBe("Enter a valid email address.");
  });

  it("rejects a phone number that is too short", () => {
    expect(validateRegister({ ...valid, phone: "12345" }).phone).toBe("Enter a valid phone number.");
  });

  it("allows an empty reason and rejects one past the limit", () => {
    expect(validateRegister({ ...valid, reason: "" })).toEqual({});
    expect(validateRegister({ ...valid, reason: "a".repeat(REASON_LIMIT + 1) }).reason).toMatch(/2,500/);
  });
});

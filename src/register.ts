export const REASON_LIMIT = 2500;

export const DIAL_CODES = [
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "VN", name: "Vietnam", dial: "+84" },
] as const;

export type RegisterInput = {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  phone: string;
  email: string;
  reason: string;
};

export type RegisterField = keyof RegisterInput;

export type RegisterErrors = Partial<Record<RegisterField, string>>;

const CONSUMER_ROOTS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.net",
  "ymail.com",
  "rocketmail.com",
  "mail.com",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isConsumerDomain(domain: string) {
  const host = domain.toLowerCase().replace(/\.+$/, "");
  if (CONSUMER_ROOTS.some((root) => host === root || host.endsWith(`.${root}`))) return true;
  return host.startsWith("yahoo.") || host.startsWith("hotmail.") || host.startsWith("outlook.");
}

export function validateRegister(input: RegisterInput): RegisterErrors {
  const errors: RegisterErrors = {};
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const company = input.company.trim();
  const jobTitle = input.jobTitle.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();
  const reason = input.reason;

  if (!firstName) errors.firstName = "Enter your first name.";
  if (!lastName) errors.lastName = "Enter your last name.";
  if (!company) errors.company = "Enter your company name.";
  if (!jobTitle) errors.jobTitle = "Enter your job title.";

  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!/^[\d\s().+-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!email) errors.email = "Enter your email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  else if (isConsumerDomain(email.slice(email.lastIndexOf("@") + 1))) {
    errors.email = "Use a business email. Gmail, Yahoo, and similar addresses are not accepted.";
  }

  if (reason.length > REASON_LIMIT) {
    errors.reason = `Reason for contact must be ${REASON_LIMIT.toLocaleString("en-US")} characters or fewer.`;
  }

  return errors;
}

import { useState, type FormEvent, type MouseEvent } from "react";
import { navigateTo } from "../navigate";
import { DIAL_CODES, REASON_LIMIT, validateRegister, type RegisterErrors } from "../register";
import { LandingFooter, LandingNav } from "./LandingChrome";
import "../register.css";

const FIELD_ORDER = ["firstName", "lastName", "company", "jobTitle", "phone", "email", "reason"] as const;

function openLanding(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  navigateTo("/landing-page");
}

function Required() {
  return (
    <span className="reg-req" aria-hidden="true">
      *
    </span>
  );
}

export function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [dialCode, setDialCode] = useState("ID");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister({ firstName, lastName, company, jobTitle, phone, email, reason });
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(firstInvalid === "phone" ? "reg-phone" : `reg-${firstInvalid}`)?.focus();
      return;
    }
    setSubmittedEmail(email.trim());
  }

  return (
    <div className="lp reg-page">
      <LandingNav />
      <main className="reg">
      <div className="reg-wrap">
        <a className="reg-back" href="/landing-page" onClick={openLanding}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M12.5 8H3.5M7 4.5 3.5 8 7 11.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </a>
        {submittedEmail ? (
          <div role="status">
            <h1 className="reg-title">You're registered</h1>
            <p className="reg-lead">We'll email log-in credentials to {submittedEmail}.</p>
          </div>
        ) : (
          <>
            <h1 className="reg-title">Register with us</h1>
            <p className="reg-lead">Fill out the form below to receive your log-in credentials</p>
            <form className="reg-card" onSubmit={onSubmit} noValidate>
              <div className="reg-grid">
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-firstName">
                    First Name <Required />
                  </label>
                  <input
                    id="reg-firstName"
                    className={`reg-input${errors.firstName ? " is-invalid" : ""}`}
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Enter your first name"
                    value={firstName}
                    aria-invalid={errors.firstName ? true : undefined}
                    aria-describedby={errors.firstName ? "reg-firstName-error" : undefined}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                  {errors.firstName ? (
                    <p id="reg-firstName-error" className="reg-error">
                      {errors.firstName}
                    </p>
                  ) : null}
                </div>

                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-lastName">
                    Last Name <Required />
                  </label>
                  <input
                    id="reg-lastName"
                    className={`reg-input${errors.lastName ? " is-invalid" : ""}`}
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Enter your last name"
                    value={lastName}
                    aria-invalid={errors.lastName ? true : undefined}
                    aria-describedby={errors.lastName ? "reg-lastName-error" : undefined}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                  {errors.lastName ? (
                    <p id="reg-lastName-error" className="reg-error">
                      {errors.lastName}
                    </p>
                  ) : null}
                </div>

                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-company">
                    Company Name <Required />
                  </label>
                  <input
                    id="reg-company"
                    className={`reg-input${errors.company ? " is-invalid" : ""}`}
                    name="organization"
                    autoComplete="organization"
                    placeholder="Enter company name"
                    value={company}
                    aria-invalid={errors.company ? true : undefined}
                    aria-describedby={errors.company ? "reg-company-error" : undefined}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                  {errors.company ? (
                    <p id="reg-company-error" className="reg-error">
                      {errors.company}
                    </p>
                  ) : null}
                </div>

                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-jobTitle">
                    Job Title <Required />
                  </label>
                  <input
                    id="reg-jobTitle"
                    className={`reg-input${errors.jobTitle ? " is-invalid" : ""}`}
                    name="organization-title"
                    autoComplete="organization-title"
                    placeholder="Enter your job title"
                    value={jobTitle}
                    aria-invalid={errors.jobTitle ? true : undefined}
                    aria-describedby={errors.jobTitle ? "reg-jobTitle-error" : undefined}
                    onChange={(event) => setJobTitle(event.target.value)}
                  />
                  {errors.jobTitle ? (
                    <p id="reg-jobTitle-error" className="reg-error">
                      {errors.jobTitle}
                    </p>
                  ) : null}
                </div>

                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-phone">
                    Phone Number <Required />
                  </label>
                  <div className={`reg-phone${errors.phone ? " is-invalid" : ""}`}>
                    <select
                      className="reg-dial"
                      name="dialCode"
                      aria-label="Country code"
                      value={dialCode}
                      onChange={(event) => setDialCode(event.target.value)}
                    >
                      {DIAL_CODES.map((entry) => (
                        <option key={entry.code} value={entry.code}>
                          {entry.name} ({entry.dial})
                        </option>
                      ))}
                    </select>
                    <span className="reg-phone-rule" aria-hidden="true" />
                    <input
                      id="reg-phone"
                      className="reg-phone-input"
                      name="phone"
                      type="tel"
                      autoComplete="tel-national"
                      inputMode="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? "reg-phone-error" : undefined}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                  {errors.phone ? (
                    <p id="reg-phone-error" className="reg-error">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>

                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-email">
                    Email <Required />
                  </label>
                  <input
                    id="reg-email"
                    className={`reg-input${errors.email ? " is-invalid" : ""}`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    placeholder="Business email only (no Gmail, Yahoo, etc.)"
                    value={email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "reg-email-error" : undefined}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  {errors.email ? (
                    <p id="reg-email-error" className="reg-error">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="reg-field reg-span">
                  <label className="reg-label" htmlFor="reg-reason">
                    Reason For Contact
                  </label>
                  <textarea
                    id="reg-reason"
                    className={`reg-textarea${errors.reason ? " is-invalid" : ""}`}
                    name="reason"
                    rows={4}
                    maxLength={REASON_LIMIT}
                    placeholder="Enter your reason for contact"
                    value={reason}
                    aria-invalid={errors.reason ? true : undefined}
                    aria-describedby={errors.reason ? "reg-reason-error" : "reg-reason-count"}
                    onChange={(event) => setReason(event.target.value.slice(0, REASON_LIMIT))}
                  />
                  <p id="reg-reason-count" className="reg-count">
                    {reason.length} / {REASON_LIMIT}
                  </p>
                  {errors.reason ? (
                    <p id="reg-reason-error" className="reg-error">
                      {errors.reason}
                    </p>
                  ) : null}
                </div>
              </div>
              <button className="reg-submit" type="submit">
                Submit
              </button>
            </form>
          </>
        )}
      </div>
      </main>
      <LandingFooter hashPrefix="/landing-page" showPartnership={false} />
    </div>
  );
}

import { useState, type FormEvent, type MouseEvent } from "react";
import { landingAssets as a } from "../landingAssets";
import { navigateTo } from "../navigate";
import "../signin.css";

function openLanding(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  navigateTo("/landing-page");
}

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (next.email || next.password) return;
    navigateTo("/");
  }

  return (
    <div className="lp sign-page">
      <section className="sign-brand">
        <span className="sign-shape is-top" aria-hidden="true" />
        <span className="sign-shape is-bottom" aria-hidden="true" />
        <a className="sign-logo" href="/landing-page" onClick={openLanding}>
          <img src={a.logoWisely} alt="Wisely AI" width={158} height={48} />
          <span className="sign-kicker">Threat Intelligence</span>
        </a>
        <div className="sign-brand-copy">
          <ul className="sign-props">
            <li>
              <span className="sign-prop-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="7.25" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M11 1.75v2.5M11 17.75v2.5M1.75 11h2.5M17.75 11h2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="sign-prop-copy">
                <p className="sign-prop-value">1.3M+</p>
                <p className="sign-prop-label">Threats detected</p>
              </span>
            </li>
            <li>
              <span className="sign-prop-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="7.25" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M11 7v4.5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="sign-prop-copy">
                <p className="sign-prop-value">&lt;5 min</p>
                <p className="sign-prop-label">Detection time</p>
              </span>
            </li>
            <li>
              <span className="sign-prop-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3.25 17.25c.45-2.7 2.3-4.1 4.75-4.1s4.3 1.4 4.75 4.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="15.25" cy="8.4" r="2.1" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M14.1 13.2c1.85.25 3.2 1.35 3.65 3.15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="sign-prop-copy">
                <p className="sign-prop-value">100M+</p>
                <p className="sign-prop-label">Users protected</p>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="sign-panel">
        <form className="sign-form" onSubmit={onSubmit} noValidate>
          <h1>Login to Threat Intelligence Portal</h1>
          <label className="sign-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="Email"
              value={email}
              aria-invalid={errors.email ? true : undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email ? <p className="sign-error">{errors.email}</p> : null}
          </label>
          <label className="sign-field">
            <span>Password</span>
            <span className="sign-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                aria-invalid={errors.password ? true : undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="sign-eye"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M2.5 10S5.5 4.5 10 4.5 17.5 10 17.5 10 14.5 15.5 10 15.5 2.5 10 2.5 10Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="10" cy="10" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  {showPassword ? <path d="M4 16 16 4" stroke="currentColor" strokeWidth="1.5" /> : null}
                </svg>
              </button>
            </span>
            {errors.password ? <p className="sign-error">{errors.password}</p> : null}
          </label>
          <button className="sign-submit" type="submit">
            Sign In
          </button>
        </form>
        <footer className="sign-foot">
          <p>© 2026 Tanla Digital Labs Private Limited. All rights reserved.</p>
          <p className="sign-powered">
            Powered By
            <span className="sign-mark">
              <img src={a.logoTonik} alt="Tanla" />
            </span>
          </p>
        </footer>
      </section>
    </div>
  );
}

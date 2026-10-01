import { useState, type MouseEvent } from "react";
import { FAQS } from "../faqs";
import { navigateTo } from "../navigate";
import { LandingFooter, LandingNav } from "./LandingChrome";
import "../faqs.css";

function openLanding(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  navigateTo("/landing-page");
}

export function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="lp faq-page">
      <LandingNav />
      <main className="faq">
        <div className="faq-wrap">
          <a className="faq-back" href="/landing-page" onClick={openLanding}>
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
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-lead">
            Wisely Threat Intelligence — common questions and answers on product vision, data security, citizen tools,
            and threat insights.
          </p>
          <div className="faq-card">
            {FAQS.map((item, index) => {
              const open = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;
              return (
                <div key={item.question} className={`faq-item${open ? " is-open" : ""}`}>
                  <h2 className="faq-heading">
                    <button
                      id={buttonId}
                      className="faq-toggle"
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? -1 : index)}
                    >
                      <span>{item.question}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path
                          d="M4 6.25 8 10.25 12 6.25"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </h2>
                  {open ? (
                    <div
                      id={panelId}
                      className="faq-answer"
                      role="region"
                      aria-labelledby={buttonId}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <LandingFooter hashPrefix="/landing-page" />
    </div>
  );
}

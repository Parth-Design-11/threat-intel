import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { assets } from "../assets";
import {
  INSIGHTS_WIDGET_CONTEXT,
  buildAgentSteps,
  buildMockResponse,
  type InsightsWidgetId,
} from "../insightsAiContext";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  steps?: string[];
};

type InsightsAiChatModalProps = {
  widgetId: InsightsWidgetId;
  period: string;
  widgetPreview: ReactNode;
  onClose: () => void;
};

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 2l1.3 4 4 1.3-4 1.3-1.3 4-1.3-4-4-1.3 4-1.3L11 2z" fill="currentColor" />
      <path d="M17.5 1l0.5 1.5 1.5 0.5-1.5 0.5-0.5 1.5-0.5-1.5-1.5-0.5 1.5-0.5 0.5-1.5z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part.split("\n").map((line, lineIndex, lines) => (
      <span key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </span>
    ));
  });
}

function AgentStepper({
  steps,
  completedSteps,
  collapsed,
  onToggle,
}: {
  steps: string[];
  completedSteps: string[];
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const allDone = steps.length > 0 && steps.every((step) => completedSteps.includes(step));
  const activeIndex = steps.findIndex((step) => !completedSteps.includes(step));

  if (!collapsed && allDone && onToggle) {
    return (
      <div className="insights-ai-stepper-wrap">
        <ol className="insights-ai-stepper" aria-label="Analysis progress">
          {steps.map((step) => (
            <li key={step} className="insights-ai-stepper-item is-done">
              <span className="insights-ai-stepper-marker" aria-hidden="true">
                ✓
              </span>
              <span className="insights-ai-stepper-label">{step}</span>
            </li>
          ))}
        </ol>
        <button type="button" className="insights-ai-stepper-hide" onClick={onToggle}>
          Hide steps
        </button>
      </div>
    );
  }

  if (collapsed && allDone && onToggle) {
    return (
      <button type="button" className="insights-ai-stepper-collapsed" onClick={onToggle}>
        <span className="insights-ai-stepper-collapsed-icon" aria-hidden="true">
          ✓
        </span>
        <span className="insights-ai-stepper-collapsed-text">Analysis complete</span>
        <span className="insights-ai-stepper-collapsed-meta">{steps.length} steps</span>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3.5 5.25 7 8.75l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  return (
    <ol className="insights-ai-stepper" aria-label="Analysis progress">
      {steps.map((step, index) => {
        const done = completedSteps.includes(step);
        const active = !done && index === activeIndex;
        return (
          <li
            key={step}
            className={`insights-ai-stepper-item${done ? " is-done" : ""}${active ? " is-active" : ""}`}
          >
            <span className="insights-ai-stepper-marker" aria-hidden="true">
              {done ? "✓" : active ? "·" : index + 1}
            </span>
            <span className="insights-ai-stepper-label">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function InsightsAiChatModal({
  widgetId,
  period,
  widgetPreview,
  onClose,
}: InsightsAiChatModalProps) {
  const context = INSIGHTS_WIDGET_CONTEXT[widgetId];
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeSteps, setActiveSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [entered, setEntered] = useState(false);
  const [expandedSteppers, setExpandedSteppers] = useState<Set<string>>(new Set());
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pendingFollowUps = context.suggestedQuestions.filter(
    (question) => !askedQuestions.includes(question),
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking, activeSteps, completedSteps, pendingFollowUps.length]);

  const runAgent = async (question: string) => {
    const steps = buildAgentSteps(widgetId, question);
    setIsThinking(true);
    setActiveSteps(steps);
    setCompletedSteps([]);

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 420));
      setCompletedSteps((current) => [...current, step]);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = buildMockResponse(widgetId, question);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "assistant", content: response, steps },
    ]);
    setIsThinking(false);
    setActiveSteps([]);
    setCompletedSteps([]);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    setAskedQuestions((current) => (current.includes(trimmed) ? current : [...current, trimmed]));
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setInput("");
    void runAgent(trimmed);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  const toggleStepper = (messageId: string) => {
    setExpandedSteppers((current) => {
      const next = new Set(current);
      if (next.has(messageId)) next.delete(messageId);
      else next.add(messageId);
      return next;
    });
  };

  const inConversation = messages.length > 0 || isThinking;
  const showFollowUps = !isThinking && pendingFollowUps.length > 0;

  return (
    <>
      <button
        type="button"
        className={`overlay insights-ai-overlay${entered ? " is-visible" : ""}`}
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className={`insights-ai-curtain${entered ? " is-open" : ""}`}
        role="dialog"
        aria-labelledby="insights-ai-title"
      >
        <button type="button" className="insights-ai-close" aria-label="Close" onClick={onClose}>
          <img src={assets.iconClose} alt="" width={16} height={16} />
        </button>

        <div className="insights-ai-curtain-inner">
          <header className={`insights-ai-hero${inConversation ? " is-compact" : ""}`}>
            <div className="insights-ai-hero-icon" aria-hidden="true">
              <SparkleIcon />
            </div>
            <h2 id="insights-ai-title" className="insights-ai-brand">
              <span className="insights-ai-brand-pill">AI</span>
              <span>Insights</span>
            </h2>
            <p className="insights-ai-hero-sub">
              {inConversation
                ? `${context.title} · ${period}`
                : `Get intelligent analysis for ${context.title.toLowerCase()}`}
            </p>
          </header>

          <div className="insights-ai-scroll" ref={threadRef}>
            <section className="insights-ai-thread" aria-label="Chat">
              <article className="insights-ai-widget-source">
                <div className="insights-ai-widget-source-head">
                  <span className="insights-ai-widget-source-label">From your dashboard</span>
                  <span className="insights-ai-widget-source-period">{period}</span>
                </div>
                <div className="insights-ai-widget-source-body">{widgetPreview}</div>
              </article>

              {messages.map((message) => (
                <div key={message.id} className={`insights-ai-message is-${message.role}`}>
                  {message.role === "assistant" && message.steps ? (
                    <AgentStepper
                      steps={message.steps}
                      completedSteps={message.steps}
                      collapsed={!expandedSteppers.has(message.id)}
                      onToggle={() => toggleStepper(message.id)}
                    />
                  ) : null}
                  <div className="insights-ai-bubble">{renderMarkdownLite(message.content)}</div>
                </div>
              ))}

              {isThinking ? (
                <div className="insights-ai-message is-assistant">
                  <AgentStepper steps={activeSteps} completedSteps={completedSteps} />
                </div>
              ) : null}

              {showFollowUps ? (
                <div className="insights-ai-followups">
                  <p className="insights-ai-followups-label">Suggested follow-ups</p>
                  <ul className="insights-ai-followup-list">
                    {pendingFollowUps.map((question) => (
                      <li key={question}>
                        <button type="button" className="insights-ai-followup-item" onClick={() => sendMessage(question)}>
                          {question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          </div>

          <form className="insights-ai-composer" onSubmit={handleSubmit}>
            <div className="insights-ai-composer-bar">
              <input
                ref={inputRef}
                className="insights-ai-input"
                type="text"
                placeholder={`Ask anything about ${context.title.toLowerCase()}…`}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isThinking}
              />
              <button
                type="submit"
                className="insights-ai-send"
                disabled={!input.trim() || isThinking}
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 3v10M8 3l4 4M8 3 4 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}

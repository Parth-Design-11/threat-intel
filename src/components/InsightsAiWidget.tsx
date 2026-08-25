import { useState, type ReactNode } from "react";
import type { InsightsWidgetId } from "../insightsAiContext";
import { InsightsAiChatModal } from "./InsightsAiChatModal";

type InsightsAiWidgetProps = {
  widgetId: InsightsWidgetId;
  period: string;
  className?: string;
  children: ReactNode;
};

function AiSparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1.2 7.8 4.4 11 5.2 7.8 6 7 9.2 6.2 6 3 5.2 6.2 4.4 7 1.2Z"
        fill="currentColor"
      />
      <path
        d="M10.8 0.5 11.2 1.7 12.4 2.1 11.2 2.5 10.8 3.7 10.4 2.5 9.2 2.1 10.4 1.7 10.8 0.5Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

export function InsightsAiWidget({ widgetId, period, className, children }: InsightsAiWidgetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`insights-ai-widget${className ? ` ${className}` : ""}`}>
        <button
          type="button"
          className="insights-ai-trigger"
          aria-label="Ask Wise Albert"
          onClick={() => setOpen(true)}
        >
          <AiSparkleIcon />
        </button>
        {children}
      </div>

      {open ? (
        <InsightsAiChatModal
          widgetId={widgetId}
          period={period}
          widgetPreview={children}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

import type { ElementType, ReactNode } from "react";
import { assets } from "../assets";
import { INSIGHTS_WIDGET_CONTEXT, type InsightsWidgetId } from "../insightsAiContext";

type InsightsWidgetTitleProps = {
  widgetId: InsightsWidgetId;
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function InsightsWidgetInfo({ widgetId }: { widgetId: InsightsWidgetId }) {
  const context = INSIGHTS_WIDGET_CONTEXT[widgetId];

  return (
    <span
      className="insights-widget-info"
      tabIndex={0}
      aria-label={`About ${context.title}`}
    >
      <img src={assets.iconInfo} alt="" width={14} height={14} />
      <span className="insights-widget-tip" role="tooltip">
        {context.description}
      </span>
    </span>
  );
}

export function InsightsWidgetTitle({
  widgetId,
  children,
  className,
  as: Tag = "p",
}: InsightsWidgetTitleProps) {
  return (
    <Tag className={`insights-widget-title${className ? ` ${className}` : ""}`}>
      <span className="insights-widget-title-text">{children}</span>
      <InsightsWidgetInfo widgetId={widgetId} />
    </Tag>
  );
}

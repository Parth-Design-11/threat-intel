import { AI_INSIGHTS } from "../insightsData";
import iconTopInsights from "../assets/insights/icon-top-insights.svg";
import iconInsightsMore from "../assets/insights/icon-insights-more.svg";

type InsightsAiSectionProps = {
  className?: string;
};

export function InsightsAiSection({ className }: InsightsAiSectionProps) {
  return (
    <section className={`insights-ai${className ? ` ${className}` : ""}`} aria-label="AI Insights">
      <header className="insights-ai-head">
        <div className="insights-ai-title">
          <span className="insights-ai-spark">
            <img src={iconTopInsights} alt="" width={20.03} height={20} />
          </span>
          <h2>{AI_INSIGHTS.title}</h2>
        </div>
        <span className="insights-ai-more">
          <img src={iconInsightsMore} alt="" width={16} height={16} />
        </span>
      </header>
      <p className="insights-ai-lead">{AI_INSIGHTS.lead}</p>
      <div className="insights-ai-list">
        {AI_INSIGHTS.cards.map((card) => (
          <article key={card.title} className="insights-ai-card">
            <h3>{card.title}</h3>
            <p>
              {card.parts.map((part, index) =>
                part.weight === "semibold" ? (
                  <strong key={index}>{part.text}</strong>
                ) : (
                  <span key={index}>{part.text}</span>
                ),
              )}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

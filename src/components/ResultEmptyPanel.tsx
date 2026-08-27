type ResultEmptyPanelProps = {
  title: string;
  description: string;
};

export function ResultEmptyPanel({ title, description }: ResultEmptyPanelProps) {
  return (
    <div className="result-empty-panel">
      <p className="result-empty-panel-title">{title}</p>
      <p className="result-empty-panel-desc">{description}</p>
    </div>
  );
}

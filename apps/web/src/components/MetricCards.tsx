import type { MetaSummary } from "../types";

type MetricCardsProps = {
  summary: MetaSummary;
};

const numberFormatter = new Intl.NumberFormat("en-US");

function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

export function MetricCards({ summary }: MetricCardsProps) {
  const metrics = [
    ["Total games", numberFormatter.format(summary.total_games)],
    ["Average top-four rate", formatPercent(summary.average_top_four_rate)],
    ["Average win rate", formatPercent(summary.average_win_rate)],
    ["Compositions", numberFormatter.format(summary.composition_count)],
  ];

  return (
    <section className="metric-cards" aria-label="Meta summary">
      {metrics.map(([label, value]) => (
        <article className="metric-card" key={label}>
          <p>{label}</p>
          <strong>{value}</strong>
        </article>
      ))}
    </section>
  );
}

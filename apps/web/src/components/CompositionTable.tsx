import type { CompositionSummary } from "../types";

type CompositionTableProps = {
  compositions: CompositionSummary[];
};

const numberFormatter = new Intl.NumberFormat("en-US");

function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

export function CompositionTable({ compositions }: CompositionTableProps) {
  return (
    <div className="table-scroll">
      <table className="composition-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Playstyle</th>
            <th>Difficulty</th>
            <th>Average placement</th>
            <th>Top-four rate</th>
            <th>Win rate</th>
            <th>Pick rate</th>
            <th>Games</th>
            <th>Meta score</th>
          </tr>
        </thead>
        <tbody>
          {compositions.map((composition) => (
            <tr key={composition.id}>
              <th scope="row">{composition.name}</th>
              <td>{composition.playstyle}</td>
              <td>{composition.difficulty}</td>
              <td>{composition.stats.average_placement.toFixed(2)}</td>
              <td>{formatPercent(composition.stats.top_four_rate)}</td>
              <td>{formatPercent(composition.stats.win_rate)}</td>
              <td>{formatPercent(composition.stats.pick_rate)}</td>
              <td>{numberFormatter.format(composition.stats.games)} games</td>
              <td>{composition.meta_score.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

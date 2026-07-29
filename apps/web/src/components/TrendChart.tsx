import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "../types";

type TrendChartProps = {
  trends: TrendPoint[];
};

function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 }).format(value);
}

export function TrendChart({ trends }: TrendChartProps) {
  return (
    <div className="trend-chart" role="img" aria-label="Composition performance by patch">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <LineChart data={trends} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <XAxis dataKey="patch" tickLine={false} axisLine={false} />
          <YAxis yAxisId="placement" domain={[1, 8]} tickLine={false} axisLine={false} width={34} />
          <YAxis
            yAxisId="rate"
            orientation="right"
            tickFormatter={formatPercent}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value, name) => {
              const numericValue = Number(value);
              return name === "Average placement"
                ? numericValue.toFixed(2)
                : formatPercent(numericValue);
            }}
          />
          <Line
            type="monotone"
            dataKey="average_placement"
            name="Average placement"
            stroke="#0d7a5f"
            strokeWidth={2}
            dot={{ r: 3 }}
            yAxisId="placement"
          />
          <Line
            type="monotone"
            dataKey="top_four_rate"
            name="Top-four rate"
            stroke="#1769aa"
            strokeWidth={2}
            dot={{ r: 3 }}
            yAxisId="rate"
          />
          <Line
            type="monotone"
            dataKey="win_rate"
            name="Win rate"
            stroke="#b85c38"
            strokeWidth={2}
            dot={{ r: 3 }}
            yAxisId="rate"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

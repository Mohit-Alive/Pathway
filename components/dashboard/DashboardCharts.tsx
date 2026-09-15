'use client';

// Export each chart as its own named export and import them individually
// from Server Components (never `import DashboardCharts from ...` + dot
// access). Next's client-reference transform only instruments direct
// module exports; bundling these into a plain object and reading a
// property off it server-side resolves to `undefined` at render time.

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface WeeklyProgressPoint {
  day: string;
  hours: number;
  planned: number;
}

export function WeeklyBarChart({ data }: { data: WeeklyProgressPoint[] }) {
  return (
    <div className="h-[120px] w-full min-w-0 min-h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="hours"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActivityLineChart({ data }: { data: WeeklyProgressPoint[] }) {
  return (
    <div className="h-[180px] w-full min-w-0 min-h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="hours"
            name="Hours Spent"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="planned"
            name="Planned Target"
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

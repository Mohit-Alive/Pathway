'use client';

// Export each chart as its own named export and import them individually
// from Server Components (never `import ProgressCharts from ...` + dot
// access). Next's client-reference transform only instruments direct
// module exports; bundling these into a plain object and reading a
// property off it server-side resolves to `undefined` at render time.

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

export function AreaHoursChart({ data }: { data: { week: string; hours: number }[] }) {
  return (
    <div className="h-[260px] w-full min-w-0 min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHoursProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px", fontWeight: "bold" }} />
          <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHoursProgress)" activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({ data }: { data: { category: string; completed: number; total: number }[] }) {
  return (
    <div className="h-[260px] w-full min-w-0 min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} />
          <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px", fontWeight: "bold" }} />
          <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={20} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ data }: { data: { category: string; total: number }[] }) {
  const pieData = data.map((d) => ({ name: d.category, value: d.total }));

  return (
    <div className="h-[180px] w-full min-w-0 min-h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius="61%"
            outerRadius="83%"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            isAnimationActive={false}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px", fontWeight: "bold" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, subtext, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
        {icon && <div className="p-2 bg-zinc-50 rounded-xl">{icon}</div>}
      </div>
      <div>
        <p className="text-4xl font-extrabold text-zinc-900 tracking-tight">{value}</p>
        {subtext && (
          <p className="text-sm font-medium text-zinc-500 mt-2">{subtext}</p>
        )}
      </div>
    </div>
  );
}

'use client';

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/shell/PageHeader';

const mockProgressData = [
  { week: 'W1', hours: 4, score: 65, efficiency: 70 },
  { week: 'W2', hours: 7, score: 72, efficiency: 75 },
  { week: 'W3', hours: 12, score: 85, efficiency: 82 },
  { week: 'W4', hours: 15, score: 88, efficiency: 85 },
  { week: 'W5', hours: 10, score: 86, efficiency: 80 },
  { week: 'W6', hours: 18, score: 95, efficiency: 92 },
];

const mockSkillDistribution = [
  { name: 'HTML/CSS', value: 35 },
  { name: 'JavaScript', value: 45 },
  { name: 'React', value: 20 },
];
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        title="Progress Metrics"
        actions={
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export Report</span>
          </button>
        }
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Total Study Time', value: '164h', change: '+12%', positive: true },
              { title: 'Average Score', value: '88.5%', change: '+4.2%', positive: true },
              { title: 'Modules Completed', value: '42/60', change: '+8', positive: true },
              { title: 'Learning Velocity', value: 'High', change: 'Top 10%', positive: true },
            ].map((metric, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">{metric.title}</h3>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{metric.value}</span>
                  <span className={`text-[11px] font-extrabold mb-1.5 px-2 py-0.5 rounded-md ${metric.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Learning Hours Area Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800">Study Hours Trend</h3>
              </div>
              <div className="h-[300px] w-full min-w-0 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockProgressData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assessment Scores Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800">Assessment Scores</h3>
              </div>
              <div className="h-[300px] w-full min-w-0 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockProgressData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} activeBar={{ fill: '#7c3aed' }} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Learning Efficiency Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800">Learning Efficiency Index</h3>
              </div>
              <div className="h-[250px] w-full min-w-0 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockProgressData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                    <Line type="stepAfter" dataKey="efficiency" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Distribution Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Time Allocation</h3>
              </div>
              <div className="h-[180px] w-full min-w-0 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockSkillDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {mockSkillDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {mockSkillDistribution.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-md shadow-sm" style={{ backgroundColor: COLORS[i] }}></div>
                      <span className="font-bold text-slate-600 text-xs">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-900 text-xs">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

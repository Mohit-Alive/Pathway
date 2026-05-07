'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { 
  Bell, MessageSquare, Plus, ArrowUpRight, Search, 
  Mic, ArrowRight, BookOpen 
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const barData = [
  { day: 'Jan 2', value: 30 },
  { day: 'Jan 8', value: 85 },
  { day: 'Jan 16', value: 45 },
  { day: 'Jan 24', value: 65 },
  { day: 'Jan 31', value: 55 },
];

const lineData = [
  { day: 'Jan 1', saved: 200, searched: 400, outreached: 100 },
  { day: 'Jan 5', saved: 300, searched: 500, outreached: 150 },
  { day: 'Jan 10', saved: 250, searched: 450, outreached: 120 },
  { day: 'Jan 15', saved: 400, searched: 600, outreached: 200 },
  { day: 'Jan 20', saved: 350, searched: 550, outreached: 180 },
  { day: 'Jan 25', saved: 500, searched: 700, outreached: 250 },
  { day: 'Jan 31', saved: 450, searched: 800, outreached: 300 },
];

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-[280px] transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded shadow-sm text-slate-500">⌘K</kbd>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm ml-2">
              <Plus className="w-4 h-4" />
              Invite Team
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Learning Insight */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 blur-3xl opacity-50 -z-10 rounded-full translate-x-10 -translate-y-10"></div>
                <div>
                  <h3 className="text-sm font-bold text-blue-600 mb-6 tracking-wide">Learning Insight</h3>
                  <div className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">70%</div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-[200px]">
                    <span className="text-slate-900 font-bold">Data Engineering</span> is in high demand with only 30% supply.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="h-3.5 w-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 mb-2 shadow-inner"></div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Hours Learned (Bar Chart) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Hours Learned</h3>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Last month</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">21,230</div>
                <div className="h-[120px] w-full min-w-0 min-h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                        isAnimationActive={false}
                      />
                      <Bar dataKey="value" fill="#bfdbfe" radius={[4, 4, 0, 0]} barSize={12} activeBar={{ fill: '#3b82f6' }} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 px-2 uppercase">
                  <span>Jan 2</span>
                  <span>Jan 8</span>
                  <span>Jan 16</span>
                  <span>Jan 31</span>
                </div>
              </div>

              {/* Curated Highlight */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Curated Highlight</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Resources matching technical parameter</p>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Advanced React Patterns', role: 'Senior Frontend Dev', match: '+ 94%' },
                    { name: 'System Design Interview', role: 'Lead Data Scientist', match: '+ 92%' },
                    { name: 'Machine Learning Basics', role: 'Senior ML Engineer', match: '+ 91%' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer border border-transparent hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</p>
                          <p className="text-[11px] font-medium text-slate-500">{item.role}</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[11px] font-extrabold rounded-md border border-blue-100">
                        {item.match}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Schedule / Roadmap Path */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
                 <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Schedule</h3>
                  <button className="text-xs font-bold text-slate-500 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    Today
                  </button>
                </div>
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2 mt-4">
                  {[
                    { time: '09:00', type: 'Interview', title: 'Sr. Product Manager', color: 'bg-purple-100 text-purple-700' },
                    { time: '10:00', type: 'Assessment', title: 'Software Engineer', color: 'bg-slate-100 text-slate-700' },
                    { time: '11:00', type: 'Screening', title: 'Lead Frontend Dev', color: 'bg-emerald-100 text-emerald-700' },
                  ].map((item, i) => (
                    <div key={i} className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white shadow-sm"></div>
                      <div className="text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">{item.time}</div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${item.color}`}>
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Skill Gap */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Critical Skill Gap</h3>
                  <button className="text-xs font-extrabold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors uppercase tracking-wider">
                    See All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Skills</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Action Required</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-slate-50">
                        <td className="py-4">
                          <p className="font-bold text-slate-800 text-sm">Machine Learning</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">8 Modules</p>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-100 text-red-600 text-[11px] font-extrabold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Urgent
                          </span>
                        </td>
                        <td className="py-4 font-bold text-slate-600 text-xs">Start Basics Course</td>
                      </tr>
                      <tr className="border-b border-slate-50">
                        <td className="py-4">
                          <p className="font-bold text-slate-800 text-sm">Cloud Architecture</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">10 Modules</p>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-600 text-[11px] font-extrabold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Moderate
                          </span>
                        </td>
                        <td className="py-4 font-bold text-slate-600 text-xs">Review AWS Certs</td>
                      </tr>
                      <tr>
                        <td className="py-4">
                          <p className="font-bold text-slate-800 text-sm">Product Design</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">4 Modules</p>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-extrabold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Stable
                          </span>
                        </td>
                        <td className="py-4 font-bold text-slate-600 text-xs">Stable Capacity</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Trending Skills */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
                <h3 className="text-sm font-bold text-slate-800 mb-6">Trending Skills</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Generative AI', val: '34%', width: 'w-[80%]', bg: 'bg-blue-100/50 text-blue-800' },
                    { name: 'Rust', val: '28%', width: 'w-[65%]', bg: 'bg-slate-100 text-slate-700' },
                    { name: 'Cloud Security', val: '20%', width: 'w-[45%]', bg: 'bg-slate-100 text-slate-700' },
                    { name: 'Software Engineer', val: '12%', width: 'w-[30%]', bg: 'bg-slate-100 text-slate-700' },
                    { name: 'Data Analyst', val: '8%', width: 'w-[15%]', bg: 'bg-slate-100 text-slate-700' },
                  ].map((item, i) => (
                    <div key={i} className="relative h-8 flex items-center justify-between px-3 rounded-md overflow-hidden z-10 group cursor-pointer">
                      <div className={`absolute left-0 top-0 bottom-0 ${item.bg} ${item.width} -z-10 rounded-md transition-all group-hover:brightness-95`}></div>
                      <span className="text-xs font-bold text-slate-800">{item.name}</span>
                      <span className="text-[11px] font-extrabold text-slate-600">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
                <div className="flex items-center gap-6 mb-6">
                   <h3 className="text-sm font-bold text-slate-800 mr-4">Learning Activity</h3>
                   <div className="flex gap-4 text-xs">
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-md bg-blue-500 shadow-sm"></div>
                       <div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modules</span>
                         <span className="font-extrabold text-slate-900 text-sm">829</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-md bg-orange-400 shadow-sm"></div>
                       <div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hours</span>
                         <span className="font-extrabold text-slate-900 text-sm">1,728</span>
                       </div>
                     </div>
                   </div>
                </div>
                <div className="h-[180px] w-full min-w-0 min-h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                      <Tooltip 
                        cursor={false}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                        isAnimationActive={false}
                      />
                      <Line type="monotone" dataKey="searched" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} isAnimationActive={false} />
                      <Line type="monotone" dataKey="saved" stroke="#fb923c" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 flex flex-col relative overflow-hidden">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Aoscan Assistant</h3>
                <div className="flex-1 flex items-center justify-center relative">
                   <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 opacity-80 blur-[2px] animate-pulse"></div>
                   <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] rounded-full mix-blend-overlay"></div>
                </div>
                <div className="mt-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mic className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ask about curriculum..." 
                    className="block w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    <button className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

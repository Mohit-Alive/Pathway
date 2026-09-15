import Link from "next/link";
import { PageHeader } from "@/components/shell/PageHeader";
import { getDashboardMetrics } from "@/lib/dal/metrics";
import {
  Bell,
  MessageSquare,
  Search,
  BookOpen,
  ArrowRight,
  Mic,
  ArrowUpRight,
} from "lucide-react";
import { WeeklyBarChart, ActivityLineChart } from "@/components/dashboard/DashboardCharts";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <>
      <PageHeader
        title="Dashboard"
        search={
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search curriculum, skills, or topics"
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-[280px] transition-all"
            />
          </div>
        }
        actions={
          <>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
          </>
        }
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pace Index / Learning Insight */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 blur-3xl opacity-50 -z-10 rounded-full translate-x-10 -translate-y-10"></div>
              <div>
                <h3 className="text-sm font-bold text-blue-600 mb-4 tracking-wide uppercase">
                  {metrics.paceLabel}
                </h3>
                <div className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {metrics.paceIndex}%
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Target Track: <span className="text-slate-900 font-bold">{metrics.userTrack}</span>. {metrics.paceSubtext}.
                </p>
              </div>
              <div className="mt-8">
                <div className="h-3.5 w-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 mb-2 shadow-inner"></div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Behind</span>
                  <span>On Track</span>
                  <span>Ahead</span>
                </div>
              </div>
            </div>

            {/* Hours Learned / Activity Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">Hours Learned</h3>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Last 7 Days</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                {metrics.totalHoursLearned} hrs
              </div>
              <WeeklyBarChart data={metrics.weeklyProgress} />
            </div>

            {/* Curated Recommendations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800">Recommended Next</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Unlocked roadmap modules</p>
              </div>
              <div className="space-y-3">
                {metrics.recommendedNext.length > 0 ? (
                  metrics.recommendedNext.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between group border border-slate-100 hover:bg-slate-50 p-2.5 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500">
                            {item.category} • {item.hours}h
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 font-medium py-4">No active roadmap modules unlocked yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Plan */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Today&apos;s Plan</h3>
                <span className="text-xs font-bold text-slate-500 px-2.5 py-1 border border-slate-200 rounded-lg">
                  Scheduled
                </span>
              </div>
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2 mt-4">
                {metrics.todaysPlan.map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white shadow-sm"></div>
                    <div className="text-[10px] font-extrabold text-slate-400 mb-1 uppercase">{item.time}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {item.duration}
                      </span>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules Needing Attention */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Modules Needing Attention</h3>
                <a href="/roadmap" className="text-xs font-extrabold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors uppercase tracking-wider">
                  View Roadmap <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Module</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {metrics.modulesNeedingAttention.map((m) => (
                      <tr key={m.id} className="border-b border-slate-50">
                        <td className="py-3">
                          <p className="font-bold text-slate-800 text-sm">{m.title}</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">{m.reason}</p>
                        </td>
                        <td className="py-3 text-xs font-bold text-slate-600">{m.category}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-600 text-[11px] font-extrabold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Priority
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Skill Mix */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Your Skill Mix</h3>
              <div className="space-y-3">
                {metrics.skillMix.map((item, i) => (
                  <div key={i} className="relative h-8 flex items-center justify-between px-3 rounded-md overflow-hidden z-10 group">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-blue-50 border border-blue-100 -z-10 rounded-md transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <span className="text-[11px] font-extrabold text-slate-600">{item.hours}h ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Activity Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
              <div className="flex items-center gap-6 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Learning Activity</h3>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modules Completed</span>
                    <span className="font-extrabold text-slate-900 text-sm">{metrics.completedModulesCount} / {metrics.totalModulesCount}</span>
                  </div>
                </div>
              </div>
              <ActivityLineChart data={metrics.weeklyProgress} />
            </div>

            {/* AI Assistant card */}
            <Link
              href="/assistant"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 flex flex-col justify-between transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">Pathway Assistant</h3>
                <p className="text-xs text-slate-500 font-medium">Ask questions about your CS track curriculum and roadmap.</p>
              </div>
              <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mic className="h-4 w-4 text-slate-400" />
                </div>
                <div className="block w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50 text-slate-400 group-hover:bg-white group-hover:border-blue-300 transition-all">
                  Ask about curriculum...
                </div>
                <div className="absolute inset-y-0 right-1 flex items-center">
                  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

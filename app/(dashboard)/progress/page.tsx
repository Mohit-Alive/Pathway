import { PageHeader } from "@/components/shell/PageHeader";
import { getProgressMetrics } from "@/lib/dal/metrics";
import { Download } from "lucide-react";
import { AreaHoursChart, CategoryBarChart, CategoryPieChart } from "@/components/progress/ProgressCharts";

export default async function ProgressPage() {
  const metrics = await getProgressMetrics();

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

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Metrics Cards - Responsive ladder 1 -> 2 -> 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Total Study Time
              </h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.totalHoursSpent}h
                </span>
                <span className="text-[11px] font-extrabold mb-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                  Track Total
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Average Quiz Score
              </h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.averageQuizScore}
                </span>
                <span className="text-[11px] font-extrabold mb-1.5 px-2 py-0.5 rounded-md bg-purple-50 text-purple-600">
                  Evaluated
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Modules Completed
              </h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.totalModulesCompleted}
                </span>
                <span className="text-[11px] font-extrabold mb-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
                  {metrics.overallCompletionPercentage}% Complete
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Consistency
              </h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.streakDays} Days
                </span>
                <span className="text-[11px] font-extrabold mb-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600">
                  {metrics.activeDaysLast7}/7 Active
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Study Hours Trend Area Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800">Study Hours Trend</h3>
              </div>
              <AreaHoursChart data={metrics.weeklyBuckets} />
            </div>

            {/* Assessment Scores / Module Completion Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800">Category Progress</h3>
              </div>
              <CategoryBarChart data={metrics.categoryBreakdown} />
            </div>

            {/* Time Allocation Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Category Allocation</h3>
              </div>
              <CategoryPieChart data={metrics.categoryBreakdown} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

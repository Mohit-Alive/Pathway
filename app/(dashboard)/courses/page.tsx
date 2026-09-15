import Link from "next/link";
import { getCoursesList } from "@/lib/dal/courses";
import { PageHeader } from "@/components/shell/PageHeader";
import { ChevronRight, GraduationCap, Search } from "lucide-react";

export default async function CoursesCatalogPage() {
  const courses = await getCoursesList();

  return (
    <>
      <PageHeader
        title="Interactive Courses"
        search={
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col min-h-[240px]"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-6 flex-1">
                  {c.description}
                </p>
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-t border-slate-50 pt-4">
                  <span>{c.totalChapters} Modules</span>
                  <span className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                    {c.isCompleted ? "Completed ✓" : "Start"} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

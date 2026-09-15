import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseDetail } from "@/lib/dal/courses";
import { PageHeader } from "@/components/shell/PageHeader";
import { ArrowLeft, PlayCircle, CheckCircle2 } from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const detail = await getCourseDetail(courseId);

  if (!detail) {
    notFound();
  }

  const { course, chapters, completedChapters } = detail;
  const firstChapter = chapters[0];

  return (
    <>
      <PageHeader
        title={course.title}
        leading={
          <Link
            href="/courses"
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        }
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                Course Modules
              </h2>
              <p className="text-sm text-slate-500 font-medium">{course.description}</p>
            </div>

            <div className="divide-y divide-slate-100">
              {chapters.map((ch, idx) => {
                const isDone = completedChapters.includes(ch.id);
                return (
                  <Link
                    key={ch.id}
                    href={`/courses/${course.id}/${ch.id}`}
                    className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${
                          isDone
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                        {ch.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      {ch.estimatedMinutes} Mins
                    </span>
                  </Link>
                );
              })}
            </div>

            {firstChapter && (
              <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <Link
                  href={`/courses/${course.id}/${firstChapter.id}`}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  Start First Module <PlayCircle className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

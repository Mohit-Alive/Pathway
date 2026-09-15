import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterContent } from "@/lib/dal/courses";
import { PageHeader } from "@/components/shell/PageHeader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;
  const data = await getChapterContent(courseId, chapterId);

  if (!data) {
    notFound();
  }

  const { chapter } = data;
  const cleanHtml = DOMPurify.sanitize(chapter.content);

  return (
    <>
      <PageHeader
        title={chapter.title}
        leading={
          <Link
            href={`/courses/${courseId}`}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        }
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-white">
        <div className="max-w-3xl mx-auto pb-32">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            {chapter.title}
          </h2>
          <div
            className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex justify-end">
          <Link
            href={`/courses/${courseId}/${chapterId}/quiz`}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
          >
            Take Chapter Quiz <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

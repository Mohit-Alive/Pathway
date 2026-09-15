import { NextResponse } from "next/server";
import { getChapterContent } from "@/lib/dal/courses";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params;
    const data = await getChapterContent(courseId, chapterId);

    if (!data) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({
      questions: data.questions,
    });
  } catch (error: any) {
    console.error("Fetch quiz questions error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch quiz questions" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { submitQuizAttempt } from "@/lib/dal/courses";

export async function POST(req: Request) {
  try {
    await requireUser();
    const body = await req.json();

    const { chapterId, answers } = body;
    if (!chapterId || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid quiz submission payload" }, { status: 400 });
    }

    const result = await submitQuizAttempt(chapterId, answers);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit quiz." },
      { status: 500 }
    );
  }
}

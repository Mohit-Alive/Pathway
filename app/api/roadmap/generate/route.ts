import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { generatePersonalizedRoadmap, QuestionnaireAnswers } from "@/lib/groq/generator";

export const maxDuration = 60; // Set Vercel function timeout to 60s

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const answers: QuestionnaireAnswers = {
      track: body.track || "Frontend Development",
      goal: body.goal || "Master modern web development",
      timelineWeeks: Number(body.timelineWeeks) || 12,
      daysPerWeek: Number(body.daysPerWeek) || 5,
      hoursPerSession: Number(body.hoursPerSession) || 2,
      experienceLevel: body.experienceLevel || "Beginner",
      languagesKnown: Array.isArray(body.languagesKnown) ? body.languagesKnown : [],
      hasShipped: Boolean(body.hasShipped),
      learningStyles: Array.isArray(body.learningStyles) ? body.learningStyles : ["Hands-on Projects"],
      additionalNotes: body.additionalNotes?.slice(0, 200) || "",
    };

    const roadmapId = await generatePersonalizedRoadmap(user.id, answers);

    return NextResponse.json({
      success: true,
      roadmapId,
      message: "Roadmap generated successfully.",
    });
  } catch (error: any) {
    console.error("Roadmap generation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate roadmap.",
      },
      { status: 500 }
    );
  }
}

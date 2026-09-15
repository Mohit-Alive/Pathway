import { getOptionalUser, requireUser } from "@/lib/auth";
import { db } from "@/lib/db/client";
import {
  courses,
  chapters,
  quizQuestions,
  userCourseProgress,
  quizAttempts,
} from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { withDbRetry } from "@/lib/db/retry";

export interface PublicQuizQuestion {
  id: string;
  chapterId: string;
  position: number;
  question: string;
  options: string[];
}

export interface QuizEvaluationResult {
  score: number;
  total: number;
  passed: boolean;
  questionResults: {
    questionId: string;
    userAnswer: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export async function getCoursesList() {
  const user = await getOptionalUser();

  const allCourses = await withDbRetry(() =>
    db.select().from(courses).orderBy(asc(courses.position))
  );

  const progressMap = new Map<string, string[]>();
  if (user) {
    const userProgress = await withDbRetry(() =>
      db.select().from(userCourseProgress).where(eq(userCourseProgress.userId, user.id))
    );

    for (const p of userProgress) {
      progressMap.set(p.courseId, p.completedChapters);
    }
  }

  // Count total chapters per course
  const allChapters = await withDbRetry(() =>
    db.select({ id: chapters.id, courseId: chapters.courseId }).from(chapters)
  );
  const chapterCounts = new Map<string, number>();
  for (const ch of allChapters) {
    chapterCounts.set(ch.courseId, (chapterCounts.get(ch.courseId) ?? 0) + 1);
  }

  return allCourses.map((c) => {
    const completed = progressMap.get(c.id) ?? [];
    const totalChapters = chapterCounts.get(c.id) ?? 0;
    const isCompleted = totalChapters > 0 && completed.length >= totalChapters;

    return {
      ...c,
      completedChapterIds: completed,
      totalChapters,
      isCompleted,
    };
  });
}

export async function getCourseDetail(courseId: string) {
  const user = await getOptionalUser();

  const foundCourse = await withDbRetry(() =>
    db.select().from(courses).where(eq(courses.id, courseId)).limit(1)
  );

  if (foundCourse.length === 0) {
    return null;
  }

  const courseChapters = await withDbRetry(() =>
    db
      .select({
        id: chapters.id,
        courseId: chapters.courseId,
        title: chapters.title,
        position: chapters.position,
        estimatedMinutes: chapters.estimatedMinutes,
      })
      .from(chapters)
      .where(eq(chapters.courseId, courseId))
      .orderBy(asc(chapters.position))
  );

  let completedChapters: string[] = [];
  if (user) {
    const progress = await withDbRetry(() =>
      db
        .select()
        .from(userCourseProgress)
        .where(
          and(
            eq(userCourseProgress.userId, user.id),
            eq(userCourseProgress.courseId, courseId)
          )
        )
        .limit(1)
    );

    if (progress.length > 0) {
      completedChapters = progress[0].completedChapters;
    }
  }

  return {
    course: foundCourse[0],
    chapters: courseChapters,
    completedChapters,
  };
}

export async function getChapterContent(courseId: string, chapterId: string) {
  const chapterRow = await withDbRetry(() =>
    db
      .select()
      .from(chapters)
      .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
      .limit(1)
  );

  if (chapterRow.length === 0) {
    return null;
  }

  // Explicit allowlist: fetch quiz questions WITHOUT correct_index or explanation
  const questions: PublicQuizQuestion[] = await withDbRetry(() =>
    db
      .select({
        id: quizQuestions.id,
        chapterId: quizQuestions.chapterId,
        position: quizQuestions.position,
        question: quizQuestions.question,
        options: quizQuestions.options,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.chapterId, chapterId))
      .orderBy(asc(quizQuestions.position))
  );

  return {
    chapter: chapterRow[0],
    questions,
  };
}

export async function submitQuizAttempt(
  chapterId: string,
  userAnswers: Record<string, number> // questionId -> selectedOptionIndex
): Promise<QuizEvaluationResult> {
  const user = await requireUser();

  const fullQuestions = await withDbRetry(() =>
    db
      .select({
        id: quizQuestions.id,
        chapterId: quizQuestions.chapterId,
        position: quizQuestions.position,
        question: quizQuestions.question,
        options: quizQuestions.options,
        correctIndex: quizQuestions.correctIndex,
        explanation: quizQuestions.explanation,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.chapterId, chapterId))
      .orderBy(asc(quizQuestions.position))
  );

  if (fullQuestions.length === 0) {
    throw new Error("No quiz questions found for this chapter.");
  }

  let score = 0;
  const questionResults = fullQuestions.map((q) => {
    const userAnswer = userAnswers[q.id] ?? -1;
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) score++;

    return {
      questionId: q.id,
      userAnswer,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = fullQuestions.length;
  // Dynamic threshold: Math.ceil(total * 0.6)
  const passThreshold = Math.ceil(total * 0.6);
  const passed = score >= passThreshold;

  // Record attempt
  await db.insert(quizAttempts).values({
    userId: user.id,
    chapterId,
    score,
    totalQuestions: total,
    passed,
    answers: fullQuestions.map((q) => userAnswers[q.id] ?? -1),
  });

  if (passed) {
    // Get courseId for chapter
    const ch = await db
      .select({ courseId: chapters.courseId })
      .from(chapters)
      .where(eq(chapters.id, chapterId))
      .limit(1);

    if (ch.length > 0) {
      const courseId = ch[0].courseId;
      const existingProgress = await db
        .select()
        .from(userCourseProgress)
        .where(
          and(
            eq(userCourseProgress.userId, user.id),
            eq(userCourseProgress.courseId, courseId)
          )
        )
        .limit(1);

      let currentCompleted = existingProgress[0]?.completedChapters ?? [];
      if (!currentCompleted.includes(chapterId)) {
        currentCompleted = [...currentCompleted, chapterId];
      }

      const now = new Date();
      await db
        .insert(userCourseProgress)
        .values({
          userId: user.id,
          courseId,
          completedChapters: currentCompleted,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [userCourseProgress.userId, userCourseProgress.courseId],
          set: {
            completedChapters: currentCompleted,
            updatedAt: now,
          },
        });
    }
  }

  return {
    score,
    total,
    passed,
    questionResults,
  };
}

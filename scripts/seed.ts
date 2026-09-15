import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { courses, chapters, quizQuestions, curatedResources } from "../lib/db/schema";
import { seedCourses } from "../lib/seed-data/courses";
import { seedResources } from "../lib/seed-data/resources";
import { eq, and } from "drizzle-orm";

async function main() {
  const { db } = await import("../lib/db/client");
  console.log("🌱 Seeding database...");

  // 1. Seed Courses, Chapters, Quiz Questions
  for (const c of seedCourses) {
    console.log(` -> Seeding course: ${c.title} (${c.id})`);

    // Upsert Course
    await db
      .insert(courses)
      .values({
        id: c.id,
        title: c.title,
        description: c.description,
        icon: c.icon,
        category: c.category,
        level: c.level,
        estimatedHours: c.estimatedHours,
        position: c.position,
      })
      .onConflictDoUpdate({
        target: courses.id,
        set: {
          title: c.title,
          description: c.description,
          icon: c.icon,
          category: c.category,
          level: c.level,
          estimatedHours: c.estimatedHours,
          position: c.position,
        },
      });

    for (const ch of c.chapters) {
      console.log(`    -> Chapter: ${ch.title} (${ch.id})`);

      // Upsert Chapter
      await db
        .insert(chapters)
        .values({
          id: ch.id,
          courseId: c.id,
          title: ch.title,
          content: ch.content,
          position: ch.position,
          estimatedMinutes: ch.estimatedMinutes,
        })
        .onConflictDoUpdate({
          target: chapters.id,
          set: {
            title: ch.title,
            content: ch.content,
            position: ch.position,
            estimatedMinutes: ch.estimatedMinutes,
          },
        });

      // Upsert Quiz Questions
      for (const q of ch.quiz) {
        const existing = await db
          .select()
          .from(quizQuestions)
          .where(
            and(
              eq(quizQuestions.chapterId, ch.id),
              eq(quizQuestions.position, q.position)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(quizQuestions)
            .set({
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
            })
            .where(eq(quizQuestions.id, existing[0].id));
        } else {
          await db.insert(quizQuestions).values({
            chapterId: ch.id,
            position: q.position,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
          });
        }
      }
    }
  }

  // 2. Seed Curated Resources
  console.log(" -> Seeding curated resources...");
  for (const r of seedResources) {
    const existing = await db
      .select()
      .from(curatedResources)
      .where(eq(curatedResources.url, r.url))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(curatedResources).values(r);
    } else {
      await db
        .update(curatedResources)
        .set({
          title: r.title,
          description: r.description,
          type: r.type,
          iconKey: r.iconKey,
          tags: r.tags,
          level: r.level,
          estimatedMinutes: r.estimatedMinutes,
          rating: r.rating,
        })
        .where(eq(curatedResources.id, existing[0].id));
    }
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

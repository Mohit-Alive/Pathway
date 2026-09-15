import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const courses = pgTable("courses", {
  id: text("id").primaryKey(), // e.g. "js-fundamentals"
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").default("Code").notNull(),
  category: text("category").notNull(),
  level: text("level").default("Beginner").notNull(),
  estimatedHours: integer("estimated_hours").default(10).notNull(),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const chapters = pgTable("chapters", {
  id: text("id").primaryKey(), // e.g. "js-c1"
  courseId: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(), // HTML content
  position: integer("position").default(0).notNull(),
  estimatedMinutes: integer("estimated_minutes").default(30).notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  chapterId: text("chapter_id")
    .references(() => chapters.id, { onDelete: "cascade" })
    .notNull(),
  position: integer("position").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctIndex: integer("correct_index").notNull(), // Server-only, strictly unexposed
  explanation: text("explanation").notNull(), // Server-only, returned post-submit
});

export const userCourseProgress = pgTable(
  "user_course_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    courseId: text("course_id")
      .references(() => courses.id, { onDelete: "cascade" })
      .notNull(),
    completedChapters: jsonb("completed_chapters")
      .$type<string[]>()
      .default([])
      .notNull(),
    completedAt: timestamp("completed_at", { mode: "date" }),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    unique("user_course_progress_unique").on(table.userId, table.courseId),
  ]
);

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  chapterId: text("chapter_id")
    .references(() => chapters.id, { onDelete: "cascade" })
    .notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  passed: boolean("passed").notNull(),
  answers: jsonb("answers").$type<number[]>().notNull(),
  submittedAt: timestamp("submitted_at", { mode: "date" }).defaultNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

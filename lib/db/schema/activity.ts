import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  uuid,
  date,
  uniqueIndex,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const studySessions = pgTable(
  "study_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    startedAt: timestamp("started_at", { mode: "date" }).defaultNow().notNull(),
    endedAt: timestamp("ended_at", { mode: "date" }),
    durationSeconds: integer("duration_seconds").default(0).notNull(),
    lastHeartbeatAt: timestamp("last_heartbeat_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("active_study_session_idx")
      .on(table.userId)
      .where(sql`ended_at IS NULL`),
  ]
);

export const dailyActivity = pgTable(
  "daily_activity",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(), // 'YYYY-MM-DD'
    hoursSpent: real("hours_spent").default(0.0).notNull(),
    modulesCompleted: integer("modules_completed").default(0).notNull(),
    quizzesPassed: integer("quizzes_passed").default(0).notNull(),
    streakCount: integer("streak_count").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    unique("user_daily_activity_unique").on(table.userId, table.date),
  ]
);

export type StudySession = typeof studySessions.$inferSelect;
export type DailyActivity = typeof dailyActivity.$inferSelect;

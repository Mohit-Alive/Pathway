import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID (e.g. user_2...)
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  track: text("track"),
  timezone: text("timezone").default("UTC").notNull(),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  onboardingAnswers: jsonb("onboarding_answers"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

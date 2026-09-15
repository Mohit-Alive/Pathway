import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  uuid,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const curatedResources = pgTable("curated_resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // article | video | course | doc | book | tool
  iconKey: text("icon_key").default("BookOpen").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  level: text("level").default("All Levels").notNull(),
  estimatedMinutes: integer("estimated_minutes").default(20).notNull(),
  rating: real("rating").default(4.8).notNull(),
});

export const userSavedResources = pgTable(
  "user_saved_resources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    resourceId: uuid("resource_id")
      .references(() => curatedResources.id, { onDelete: "cascade" })
      .notNull(),
    savedAt: timestamp("saved_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    unique("user_resource_unique").on(table.userId, table.resourceId),
  ]
);

export type CuratedResource = typeof curatedResources.$inferSelect;
export type UserSavedResource = typeof userSavedResources.$inferSelect;

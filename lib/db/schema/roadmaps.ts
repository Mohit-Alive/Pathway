import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  uuid,
  jsonb,
  uniqueIndex,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const roadmaps = pgTable(
  "roadmaps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    track: text("track").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    isActive: boolean("is_active").default(true).notNull(),
    budgetHours: integer("budget_hours").notNull(),
    plannedWeeks: integer("planned_weeks").notNull(),
    targetNodes: integer("target_nodes").notNull(),
    enrichmentStatus: text("enrichment_status").default("completed").notNull(), // completed | degraded | failed
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("active_user_roadmap_idx")
      .on(table.userId)
      .where(sql`is_active = true`),
  ]
);

export const roadmapNodes = pgTable("roadmap_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  roadmapId: uuid("roadmap_id")
    .references(() => roadmaps.id, { onDelete: "cascade" })
    .notNull(),
  nodeId: text("node_id").notNull(), // string identifier e.g. "node_1" or "react-foundations"
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimatedHours: integer("estimated_hours").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  positionX: doublePrecision("position_x").notNull(),
  positionY: doublePrecision("position_y").notNull(),
  isStretch: boolean("is_stretch").default(false).notNull(),
  sequenceIndex: integer("sequence_index").default(0).notNull(),
  topics: jsonb("topics").$type<string[]>().default([]).notNull(),
  projects: jsonb("projects").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const nodePrerequisites = pgTable("node_prerequisites", {
  id: uuid("id").defaultRandom().primaryKey(),
  roadmapId: uuid("roadmap_id")
    .references(() => roadmaps.id, { onDelete: "cascade" })
    .notNull(),
  nodeId: uuid("node_id")
    .references(() => roadmapNodes.id, { onDelete: "cascade" })
    .notNull(),
  prerequisiteNodeId: uuid("prerequisite_node_id")
    .references(() => roadmapNodes.id, { onDelete: "cascade" })
    .notNull(),
});

export const nodeProgress = pgTable(
  "node_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    nodeId: uuid("node_id")
      .references(() => roadmapNodes.id, { onDelete: "cascade" })
      .notNull(),
    status: text("status").notNull(), // 'in_progress' | 'completed'
    startedAt: timestamp("started_at", { mode: "date" }),
    completedAt: timestamp("completed_at", { mode: "date" }),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    unique("user_node_progress_unique").on(table.userId, table.nodeId),
  ]
);

export const generationJobs = pgTable(
  "generation_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    status: text("status").notNull(), // queued | running | completed | failed
    error: text("error"),
    attemptCount: integer("attempt_count").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("active_gen_job_idx")
      .on(table.userId)
      .where(sql`status IN ('queued', 'running')`),
  ]
);

export type Roadmap = typeof roadmaps.$inferSelect;
export type NewRoadmap = typeof roadmaps.$inferInsert;
export type RoadmapNode = typeof roadmapNodes.$inferSelect;
export type NewRoadmapNode = typeof roadmapNodes.$inferInsert;
export type NodeProgress = typeof nodeProgress.$inferSelect;

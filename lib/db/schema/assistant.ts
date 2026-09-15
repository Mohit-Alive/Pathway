import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * One row per chat turn. The server is the only writer and the only
 * reader that matters for building model context: a client can never
 * inject fake history into what the assistant sees, since the route
 * handler builds the conversation strictly from this table, not from
 * whatever the client claims the history is.
 */
export const assistantMessages = pgTable(
  "assistant_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").notNull(), // 'user' | 'assistant'
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("assistant_messages_user_created_idx").on(table.userId, table.createdAt)]
);

export type AssistantMessage = typeof assistantMessages.$inferSelect;
export type NewAssistantMessage = typeof assistantMessages.$inferInsert;

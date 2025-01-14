import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import type { ScheduleType } from "./types";
import { ulid } from "ulidx";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  //Q: Do I need to keep the names and email, or just get it from the auth provider? What if those values change, how do I update them (e.g. webhook)?
  firstName: text("first_name", { length: 100 }),
  lastName: text("last_name", { length: 100 }),
  email: text("email").unique().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export type User = typeof users.$inferSelect;

export const jobs = sqliteTable("jobs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: text("name", { length: 120 }).notNull(),
  endpoint: text("endpoint", { mode: "json" })
    .$type<{
      url: string;
      headers?: Record<string, string>;
      payload?: string;
      httpMethod?: "GET" | "POST" | "PUT";
    }>()
    .notNull(),
  schedule: text("schedule", { mode: "json" })
    .notNull()
    .$type<{ type: ScheduleType; value: string }>(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "no action" })
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export type Job = typeof jobs.$inferSelect;

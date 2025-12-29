import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trees = pgTable("trees", {
  id: serial("id").primaryKey(),
  commonName: text("common_name").notNull(),
  scientificName: text("scientific_name"),
  location: text("location").notNull(),
  height: integer("height"),
  description: text("description"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTreeSchema = createInsertSchema(trees).omit({ id: true, createdAt: true });

export type Tree = typeof trees.$inferSelect;
export type InsertTree = z.infer<typeof insertTreeSchema>;

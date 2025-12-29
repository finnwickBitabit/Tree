import { db } from "./db";
import { trees, type InsertTree } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTrees(): Promise<typeof trees.$inferSelect[]>;
  createTree(tree: InsertTree): Promise<typeof trees.$inferSelect>;
  getTree(id: number): Promise<typeof trees.$inferSelect | undefined>;
  deleteTree(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTrees() {
    return await db.select().from(trees);
  }

  async createTree(tree: InsertTree) {
    const [newTree] = await db.insert(trees).values(tree).returning();
    return newTree;
  }

  async getTree(id: number) {
    const [tree] = await db.select().from(trees).where(eq(trees.id, id));
    return tree;
  }

  async deleteTree(id: number) {
    await db.delete(trees).where(eq(trees.id, id));
  }
}

export const storage = new DatabaseStorage();

import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { todos } from "./schema";

export const getTodosByUserId = async (userId: string) => {
  return await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt));
};

export const createTodo = async (userId: string, title: string) => {
  const [todo] = await db
    .insert(todos)
    .values({
      userId,
      title,
    })
    .returning();

  return todo;
};

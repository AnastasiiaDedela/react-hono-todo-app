import { Hono } from "hono";
import { createTodo, getTodosByUserId } from "../db/queries";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HonoEnv } from "../types";

export const todos = new Hono<HonoEnv>()
  .use(authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");
    try {
      const todos = await getTodosByUserId(user.id);
      return c.json(todos);
    } catch (error) {
      console.error(`Failed to fetch todos : ${error}`);
      return c.json({ error: "Failed to fetch todos" }, 500);
    }
  })
  .post("/", async (c) => {
    const user = c.get("user");
    const { title } = await c.req.json();
    try {
      if (!title || typeof title !== "string") {
        return c.json({ error: "Title is required" }, 400);
      }
      const todo = await createTodo(user.id, title);
      return c.json(todo);
    } catch (error) {
      console.error(`Failed to create todo : ${error}`);
      return c.json({ error: "Failed to create todo" }, 500);
    }
  });

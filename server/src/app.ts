import "dotenv/config";
import "reflect-metadata";
import { Router } from "express";
import { connectDB } from "./db-connection.js";
import { createTaskRouter } from "./routes/task.routes.js";
import { createAuthRouter } from "./routes/auth.routes.js";
import { createUserRouter } from "./routes/user.routes.js";
import { createListItemRouter } from "./routes/list-item.routes.js";
import { createApp } from "./create-app.js";

// One ORM pool and router per warm Vercel function instance.
let routerPromise: Promise<Router> | undefined;

const getRouter = () => {
  routerPromise ??= connectDB()
    .then((orm) => {
      const router = Router();

      router.use("/tasks", createTaskRouter(orm));
      router.use("/auth", createAuthRouter(orm));
      router.use("/users", createUserRouter(orm));
      router.use("/goals", createListItemRouter(orm, "goals"));
      router.use("/wishlist", createListItemRouter(orm, "wishlist"));

      return router;
    })
    .catch((error: unknown) => {
      routerPromise = undefined;
      throw error;
    });

  return routerPromise;
};

const app = createApp(getRouter);

export default app;

import "dotenv/config";
import "reflect-metadata";
import express, { Router } from "express";
import cors from "cors";
import { connectDB } from "./db-connection.js";
import { createTaskRouter } from "./routes/task.routes.js";
import { createAuthRouter } from "./routes/auth.routes.js";
import { createUserRouter } from "./routes/user.routes.js";
import { createListItemRouter } from "./routes/list-item.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();
const origins = ["http://localhost:4200", process.env.CLIENT_URL].filter(
  (origin): origin is string => Boolean(origin)
);
app.use(cors({ origin: origins }));
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// One ORM pool and router per warm Vercel function instance.
let routerPromise: Promise<Router> | undefined;
const getRouter = () => {
  routerPromise ??= connectDB().then((orm) => {
    const router = Router();
    router.use("/tasks", createTaskRouter(orm));
    router.use("/auth", createAuthRouter(orm));
    router.use("/users", createUserRouter(orm));
    router.use("/goals", createListItemRouter(orm, "goals"));
    router.use("/wishlist", createListItemRouter(orm, "wishlist"));
    return router;
  }).catch((error: unknown) => {
    routerPromise = undefined;
    throw error;
  });
  return routerPromise;
};

app.use(async (req, res, next) => {
  try {
    const router = await getRouter();
    router(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.use(errorHandler);
export default app;

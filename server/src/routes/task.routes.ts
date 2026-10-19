import { Router } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";

import {
  getAllTasksController,
  getTaskByIdController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

export const createTaskRouter = (orm: MikroORM) => {
  const router = Router();
  router.use(authenticate);

  router.get("/", (req, res) => getAllTasksController(req, res, orm));
  router.get("/:id", getTaskByIdController(orm));
  router.post("/", createTaskController(orm));
  router.patch("/:id", updateTaskController(orm));
  router.delete("/:id", deleteTaskController(orm));

  return router;
};

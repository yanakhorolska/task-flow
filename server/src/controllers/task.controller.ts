import type { Request, Response } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";
import { z } from "zod";

import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../repositories/task.repository.js";

import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from "../schemas/task.schema.js";

// GET /tasks
export const getAllTasksController = async (
  req: Request,
  res: Response,
  orm: MikroORM,
) => {
  const userId = res.locals.userId as string;
  const tasks = await getAllTasks(orm, userId);

  return res.status(200).json(tasks);
};

// GET /tasks/:id
export const getTaskByIdController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const result = taskIdSchema.safeParse(req.params.id);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid task ID",
        errors: z.flattenError(result.error),
      });
    }

    const userId = res.locals.userId as string;
    const task = await getTaskById(orm, result.data, userId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  };
};

// POST /tasks
export const createTaskController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: z.flattenError(result.error),
      });
    }

    const userId = res.locals.userId as string;
    const task = await createTask(orm, result.data, userId);

    if (!task) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.status(201).json(task);
  };
};

// PATCH /tasks/:id
export const updateTaskController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const idResult = taskIdSchema.safeParse(req.params.id);
    const bodyResult = updateTaskSchema.safeParse(req.body);

    if (!idResult.success) {
      return res.status(400).json({
        message: "Invalid task ID",
        errors: z.flattenError(idResult.error),
      });
    }

    if (!bodyResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: z.flattenError(bodyResult.error),
      });
    }

    const userId = res.locals.userId as string;

    const task = await updateTask(orm, idResult.data, userId, bodyResult.data);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(task);
  };
};

// DELETE /tasks/:id
export const deleteTaskController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const result = taskIdSchema.safeParse(req.params.id);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid task ID",
        errors: z.flattenError(result.error),
      });
    }

    const userId = res.locals.userId as string;
    const deleted = await deleteTask(orm, result.data, userId);

    if (!deleted) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(204).send();
  };
};

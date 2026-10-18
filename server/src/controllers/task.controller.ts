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

export const getAllTasksController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const tasks = await getAllTasks(orm);
    res.json(tasks);
  };
};

export const getTaskByIdController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const result = taskIdSchema.safeParse(req.params.id);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid task ID",
        errors: z.flattenError(result.error),
      });
      return;
    }

    const task = await getTaskById(orm, result.data);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  };
};

export const createTaskController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: z.flattenError(result.error),
      });
      return;
    }

    const task = await createTask(orm, result.data);

    res.status(201).json(task);
  };
};

export const updateTaskController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const idResult = taskIdSchema.safeParse(req.params.id);
    const bodyResult = updateTaskSchema.safeParse(req.body);

    if (!idResult.success) {
      res.status(400).json({
        message: "Invalid task ID",
        errors: z.flattenError(idResult.error),
      });
      return;
    }

    if (!bodyResult.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: z.flattenError(bodyResult.error),
      });
      return;
    }

    const task = await updateTask(orm, idResult.data, bodyResult.data);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  };
};

export const deleteTaskController = (orm: MikroORM) => {
  return async (req: Request, res: Response) => {
    const result = taskIdSchema.safeParse(req.params.id);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid task ID",
        errors: z.flattenError(result.error),
      });
      return;
    }

    const deleted = await deleteTask(orm, result.data);

    if (!deleted) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(204).send();
  };
};

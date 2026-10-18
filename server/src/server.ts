import "dotenv/config";
import "reflect-metadata";

import express from "express";
import cors from "cors";

import { connectDB } from "./db-connection.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "./repositories/task.repository.js";

import type { MikroORM } from "@mikro-orm/postgresql";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "./schemas/task.schema.js";
import z from "zod";
import { errorHandler } from "./middleware/error-handler.js";

let orm: MikroORM;

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", async (req, res) => {
  const tasks = await getAllTasks(orm);
  res.json(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const result = taskIdSchema.safeParse(req.params.id);

  if (!result.success) {
    res.status(400).json({
      message: "Validation failed",
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
});

app.post("/tasks", async (req, res) => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(result.error),
    });
    return;
  }

  const newTask = await createTask(orm, result.data);

  res.status(201).json(newTask);
});

app.patch("/tasks/:id", async (req, res) => {
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

  if (task === null) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const result = taskIdSchema.safeParse(req.params.id);
  if (!result.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(result.error),
    });
    return;
  }

  const deletedTask = await deleteTask(orm, result.data);
  if (!deletedTask) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(204).send();
});

const startServer = async () => {
  try {
    orm = await connectDB();

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

app.get("/test-error", async (req, res) => {
  throw new Error("Test error");
});

startServer();

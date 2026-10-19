import type { MikroORM } from "@mikro-orm/postgresql";
import { Task } from "../entities/task.entity.js";
import { User } from "../entities/user.entity.js";
import type { CreateTaskInput } from "../schemas/task.schema.js";
import { z } from "zod";
import { updateTaskSchema } from "../schemas/task.schema.js";

type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// GET /tasks
export const getAllTasks = async (orm: MikroORM, userId: string) => {
  const em = orm.em.fork();

  return em.find(Task, { user: userId });
};

// GET /tasks/:id
export const getTaskById = async (
  orm: MikroORM,
  taskId: string,
  userId: string,
) => {
  const em = orm.em.fork();

  return em.findOne(Task, {
    id: taskId,
    user: userId,
  });
};

// POST /tasks
export const createTask = async (
  orm: MikroORM,
  data: CreateTaskInput,
  userId: string,
) => {
  const em = orm.em.fork();

  const user = await em.findOne(User, { id: userId });

  if (!user) {
    return null;
  }

  const task = em.create(Task, {
    title: data.title,
    status: data.status,
    priority: data.priority,
    ...(data.description !== undefined
      ? { description: data.description }
      : {}),
    ...(data.dueDate !== undefined
      ? { dueDate: data.dueDate === null ? null : new Date(data.dueDate) }
      : {}),
    user,
  });

  await em.flush();

  return task;
};

// PATCH /tasks/:id
export const updateTask = async (
  orm: MikroORM,
  taskId: string,
  userId: string,
  data: UpdateTaskInput,
) => {
  const em = orm.em.fork();

  const task = await em.findOne(Task, {
    id: taskId,
    user: userId,
  });

  if (!task) {
    return null;
  }

  em.assign(task, {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.priority !== undefined && { priority: data.priority }),
    ...(data.dueDate !== undefined && {
      dueDate: data.dueDate === null ? null : new Date(data.dueDate),
    }),
  });

  await em.flush();

  return task;
};

// DELETE /tasks/:id
export const deleteTask = async (
  orm: MikroORM,
  taskId: string,
  userId: string,
) => {
  const em = orm.em.fork();

  const task = await em.findOne(Task, {
    id: taskId,
    user: userId,
  });

  if (!task) {
    return false;
  }

  em.remove(task);
  await em.flush();

  return true;
};

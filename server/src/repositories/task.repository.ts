import { MikroORM } from "@mikro-orm/postgresql";
import { Task } from "../entities/task.entity.js";
import type { CreateTaskInput } from "../schemas/task.schema.js";
import type { UpdateTaskInput } from "../schemas/task.schema.js";

export const getAllTasks = async (orm: MikroORM) => {
  const em = orm.em.fork();

  return em.find(Task, {});
};

export const createTask = async (orm: MikroORM, data: CreateTaskInput) => {
  const em = orm.em.fork();
  const taskRepository = em.getRepository(Task);

  const task = taskRepository.create({
    title: data.title,
    ...(data.description !== undefined && { description: data.description }),
    status: data.status ?? "todo",
    priority: data.priority ?? "medium",
    ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
  });

  await em.persist(task).flush();

  return task;
};

export const getTaskById = async (orm: MikroORM, id: string) => {
  const em = orm.em.fork();
  const taskRepository = em.getRepository(Task);

  const task = await taskRepository.findOne({ id });

  return task;
};

export const updateTask = async (
  orm: MikroORM,
  id: string,
  data: UpdateTaskInput,
) => {
  const em = orm.em.fork();
  const task = await em.findOne(Task, { id });

  if (!task) {
    return null;
  }

  if (data.title !== undefined) {
    task.title = data.title;
  }
  if (data.status !== undefined) {
    task.status = data.status;
  }
  if (data.priority !== undefined) {
    task.priority = data.priority;
  }
  if (data.description !== undefined) {
    task.description = data.description;
  }
  if (data.dueDate !== undefined) {
    task.dueDate = data.dueDate === null ? null : new Date(data.dueDate);
  }

  await em.flush();
  return task;
};

export const deleteTask = async (
  orm: MikroORM,
  id: string,
): Promise<boolean> => {
  const em = orm.em.fork();
  const task = await em.findOne(Task, { id });

  if (!task) {
    return false;
  }

  em.remove(task);
  await em.flush();

  return true;
};

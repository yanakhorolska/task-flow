import type { MikroORM } from "@mikro-orm/postgresql";
import { User } from "../entities/user.entity.js";
import { Task } from "../entities/task.entity.js";

export const getUserById = async (orm: MikroORM, id: string) => {
  const em = orm.em.fork();

  return em.findOne(User, { id });
};

export const getUserByEmail = async (orm: MikroORM, email: string) => {
  const em = orm.em.fork();
  return em.findOne(User, { email });
};

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export const createUser = async (orm: MikroORM, data: CreateUserInput) => {
  const existingUser = await getUserByEmail(orm, data.email);

  if (existingUser) {
    return null;
  }

  const em = orm.em.fork();

  const user = em.create(User, data);

  await em.flush();

  return user;
};

export const getUserWithTasks = async (orm: MikroORM, userId: string) => {
  const em = orm.em.fork();

  const user = await em.findOne(User, { id: userId });
  if (!user) return null;
  const tasks = await em.find(Task, { user: userId });
  return { user, tasks };
};

export const getUsersWithTasks = async (orm: MikroORM) => {
  const em = orm.em.fork();

  const users = await em.find(User, {});
  const tasks = await em.find(Task, {});
  return users.map((user) => ({ user, tasks: tasks.filter((task) => task.user?.id === user.id) }));
};

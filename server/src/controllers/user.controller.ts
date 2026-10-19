import type { Request, Response } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";
import { z } from "zod";
import { User } from "../entities/user.entity.js";
import { Task } from "../entities/task.entity.js";
import { updateProfileSchema } from "../schemas/user.schema.js";

const publicProfile = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  birthDate: user.birthDate ? user.birthDate.toISOString().slice(0, 10) : null,
});

export const getMyProfile = async (_req: Request, res: Response, orm: MikroORM) => {
  const em = orm.em.fork();
  const user = await em.findOne(User, { id: res.locals.userId as string });
  if (!user) return res.status(401).json({ message: "Account no longer exists" });
  const tasks = await em.find(Task, { user: user.id });
  const completed = tasks.filter((task) => task.status === "done").length;
  return res.json({ ...publicProfile(user), progress: { total: tasks.length, completed, percent: tasks.length ? Math.round(completed / tasks.length * 100) : 0 } });
};

export const updateMyProfile = async (req: Request, res: Response, orm: MikroORM) => {
  const result = updateProfileSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: "Validation failed", errors: z.flattenError(result.error) });
  const em = orm.em.fork();
  const user = await em.findOne(User, { id: res.locals.userId as string });
  if (!user) return res.status(401).json({ message: "Account no longer exists" });
  const data = result.data;
  if (data.name !== undefined) user.name = data.name;
  if (data.bio !== undefined) user.bio = data.bio;
  if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;
  if (data.birthDate !== undefined) {
    user.birthDate = data.birthDate === null ? null : new Date(data.birthDate + "T00:00:00.000Z");
    if (user.birthDate && (Number.isNaN(user.birthDate.getTime()) || user.birthDate.getTime() > Date.now())) {
      return res.status(400).json({ message: "Invalid birth date" });
    }
  }
  await em.flush();
  const tasks = await em.find(Task, { user: user.id });
  const completed = tasks.filter((task) => task.status === "done").length;
  return res.json({ ...publicProfile(user), progress: { total: tasks.length, completed, percent: tasks.length ? Math.round(completed / tasks.length * 100) : 0 } });
};

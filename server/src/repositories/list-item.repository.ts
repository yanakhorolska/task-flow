import type { MikroORM } from "@mikro-orm/postgresql";
import { Goal } from "../entities/goal.entity.js";
import { WishlistItem } from "../entities/wishlist-item.entity.js";
import { User } from "../entities/user.entity.js";

export type ListKind = "goals" | "wishlist";
const entityFor = (kind: ListKind) => kind === "goals" ? Goal : WishlistItem;

export const getListItems = async (orm: MikroORM, kind: ListKind, userId: string) => {
  const em = orm.em.fork();
  return kind === "goals"
    ? em.find(Goal, { user: userId }, { orderBy: { createdAt: "DESC" } })
    : em.find(WishlistItem, { user: userId }, { orderBy: { createdAt: "DESC" } });
};

export const createListItem = async (orm: MikroORM, kind: ListKind, userId: string, title: string) => {
  const em = orm.em.fork();
  const user = await em.findOne(User, { id: userId });
  if (!user) return null;
  const item = kind === "goals"
    ? em.create(Goal, { title, user })
    : em.create(WishlistItem, { title, user });
  await em.flush();
  return item;
};

export const setListItemCompleted = async (orm: MikroORM, kind: ListKind, userId: string, id: string, completed: boolean) => {
  const em = orm.em.fork();
  const item = kind === "goals"
    ? await em.findOne(Goal, { id, user: userId })
    : await em.findOne(WishlistItem, { id, user: userId });
  if (!item) return null;
  item.completed = completed;
  await em.flush();
  return item;
};

export const deleteListItem = async (orm: MikroORM, kind: ListKind, userId: string, id: string) => {
  const em = orm.em.fork();
  const item = kind === "goals"
    ? await em.findOne(Goal, { id, user: userId })
    : await em.findOne(WishlistItem, { id, user: userId });
  if (!item) return false;
  em.remove(item);
  await em.flush();
  return true;
};

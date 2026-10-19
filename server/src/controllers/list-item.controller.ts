import type { Request, Response } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";
import { z } from "zod";
import { newListItemSchema, completionSchema, listItemIdSchema } from "../schemas/list-item.schema.js";
import { createListItem, deleteListItem, getListItems, setListItemCompleted, type ListKind } from "../repositories/list-item.repository.js";

export const getItems = async (_req: Request, res: Response, orm: MikroORM, kind: ListKind) =>
  res.json(await getListItems(orm, kind, res.locals.userId as string));

export const addItem = async (req: Request, res: Response, orm: MikroORM, kind: ListKind) => {
  const parsed = newListItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: z.flattenError(parsed.error) });
  const item = await createListItem(orm, kind, res.locals.userId as string, parsed.data.title);
  return item ? res.status(201).json(item) : res.status(401).json({ message: "User not found" });
};

export const toggleItem = async (req: Request, res: Response, orm: MikroORM, kind: ListKind) => {
  const id = listItemIdSchema.safeParse(req.params.id);
  const body = completionSchema.safeParse(req.body);
  if (!id.success || !body.success) return res.status(400).json({ message: "Invalid item ID or completed value" });
  const item = await setListItemCompleted(orm, kind, res.locals.userId as string, id.data, body.data.completed);
  return item ? res.json(item) : res.status(404).json({ message: "Item not found" });
};

export const removeItem = async (req: Request, res: Response, orm: MikroORM, kind: ListKind) => {
  const id = listItemIdSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ message: "Invalid item ID" });
  const deleted = await deleteListItem(orm, kind, res.locals.userId as string, id.data);
  return deleted ? res.status(204).send() : res.status(404).json({ message: "Item not found" });
};

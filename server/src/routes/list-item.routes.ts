import { Router } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { getItems, addItem, toggleItem, removeItem } from "../controllers/list-item.controller.js";
import type { ListKind } from "../repositories/list-item.repository.js";

export const createListItemRouter = (orm: MikroORM, kind: ListKind) => {
  const router = Router();
  router.use(authenticate);
  router.get("/", (req, res) => getItems(req, res, orm, kind));
  router.post("/", (req, res) => addItem(req, res, orm, kind));
  router.patch("/:id", (req, res) => toggleItem(req, res, orm, kind));
  router.delete("/:id", (req, res) => removeItem(req, res, orm, kind));
  return router;
};

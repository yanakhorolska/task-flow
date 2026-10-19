import { Router } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";
import { login, register } from "../controllers/auth.controller.js";

export const createAuthRouter = (orm: MikroORM) => {
  const router = Router();

  router.post("/register", (req, res) => register(req, res, orm));
  router.post("/login", (req, res) => login(req, res, orm));

  return router;
};

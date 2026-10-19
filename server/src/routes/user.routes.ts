import { Router } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { getMyProfile, updateMyProfile } from "../controllers/user.controller.js";

export const createUserRouter = (orm: MikroORM) => {
  const router = Router();
  router.use(authenticate);
  router.get("/me", (req, res) => getMyProfile(req, res, orm));
  router.patch("/me", (req, res) => updateMyProfile(req, res, orm));
  return router;
};

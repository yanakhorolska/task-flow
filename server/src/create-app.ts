import express, { type Router } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler.js";

export const createApp = (getRouter: () => Promise<Router>) => {
  const app = express();

  const origins = ["http://localhost:4200", process.env.CLIENT_URL].filter(
    (origin): origin is string => Boolean(origin),
  );

  app.use(cors({ origin: origins }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(async (req, res, next) => {
    try {
      const router = await getRouter();
      router(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandler);

  return app;
};

import { describe, test, expect, jest } from "@jest/globals";
import { Router } from "express";
import request from "supertest";

import { authenticate } from "../middleware/authenticate.middleware.js";
import { createApp } from "../create-app.js";

describe("Health API", () => {
  const getRouter = jest.fn(async () => Router());

  const app = createApp(getRouter);

  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });

    expect(getRouter).not.toHaveBeenCalled();
  });
  test("GET /tasks should return 401 without a token", async () => {
    const router = Router();

    router.get("/tasks", authenticate, (_req, res) => {
      res.json({ tasks: [] });
    });

    const getTestRouter = jest.fn(async () => router);
    const testApp = createApp(getTestRouter);

    const response = await request(testApp).get("/tasks");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Authentication required",
    });
    expect(getTestRouter).toHaveBeenCalledTimes(1);
  });
});

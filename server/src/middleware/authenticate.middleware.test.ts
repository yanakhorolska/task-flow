import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { authenticate } from "./authenticate.middleware.js";

const originalSecret = process.env.JWT_SECRET;

describe("Authentication middleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-jwt-secret";
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });
  test("should return 401 when authorization header is missing", () => {
    const req = {
      headers: {},
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });

    expect(next).not.toHaveBeenCalled();
  });
  test("should return 401 when authorization scheme is invalid", () => {
    const req = {
      headers: {
        authorization: "InvalidScheme some-token",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });
  test("should return 401 when token is missing", () => {
    const req = {
      headers: {
        authorization: "Bearer",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });
  test("should call next when token is valid", () => {
    const userId = "123";

    const token = jwt.sign({ sub: userId }, "test-jwt-secret", {
      algorithm: "HS256",
    });

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.locals.userId).toBe(userId);
    expect(res.status).not.toHaveBeenCalled();
  });
});

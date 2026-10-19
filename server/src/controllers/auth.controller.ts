import type { Request, Response } from "express";
import type { MikroORM } from "@mikro-orm/postgresql";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { generateAccessToken } from "../utils/jwt.js";
import z from "zod";

export const register = async (req: Request, res: Response, orm: MikroORM) => {
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: z.flattenError(validationResult.error),
    });
  }
  try {
    const user = await registerUser(orm, validationResult.data);

    if (user === null) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }
    return res
      .status(201)
      .json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    throw error;
  }
};

export const login = async (req: Request, res: Response, orm: MikroORM) => {
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: z.flattenError(validationResult.error),
    });
  }
  const user = await loginUser(orm, validationResult.data);
  if (user === null) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  const accessToken = generateAccessToken(user.id);
  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    accessToken,
  });
};

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (!token || scheme !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }
    res.locals.userId = payload.sub;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    next(error);
  }
};

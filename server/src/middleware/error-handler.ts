import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    next(err);
    return;
  }

  res.status(500).json({
    message: "Internal server error",
  });
};

import "dotenv/config";
import "reflect-metadata";

import express from "express";
import cors from "cors";

import { connectDB } from "./db-connection.js";
import { createTaskRouter } from "./routes/task.routes.js";

import { errorHandler } from "./middleware/error-handler.js";
import { createAuthRouter } from "./routes/auth.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const startServer = async () => {
  try {
    const orm = await connectDB();

    app.use("/tasks", createTaskRouter(orm));
    app.use("/auth", createAuthRouter(orm));

    app.use(errorHandler);

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

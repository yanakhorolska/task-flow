import "dotenv/config";
import { defineConfig } from "@mikro-orm/postgresql";
import { Task } from "./src/entities/task.entity.js";

const password = process.env.DB_PASSWORD;

if (!password) {
  throw new Error("DB_PASSWORD is missing");
}

export default defineConfig({
  entities: [Task],
  dbName: "taskflow",
  host: "localhost",
  port: 5432,
  user: "taskflow",
  password,
  migrations: {
    path: "./src/migrations",
  },
});

import "dotenv/config";
import { defineConfig } from "@mikro-orm/postgresql";
import { Task } from "./src/entities/task.entity.js";
import { User } from "./src/entities/user.entity.js";
import { Goal } from "./src/entities/goal.entity.js";
import { WishlistItem } from "./src/entities/wishlist-item.entity.js";

const password = process.env.DB_PASSWORD;

if (!password) {
  throw new Error("DB_PASSWORD is missing");
}

export default defineConfig({
  entities: [Task, User, Goal, WishlistItem],
  dbName: "taskflow",
  host: "localhost",
  port: 5432,
  user: "taskflow",
  password,
  migrations: {
    path: "./src/migrations",
  },
});

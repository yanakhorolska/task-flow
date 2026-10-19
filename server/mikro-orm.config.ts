import "dotenv/config";
import { defineConfig } from "@mikro-orm/postgresql";
import { Task } from "./src/entities/task.entity.js";
import { User } from "./src/entities/user.entity.js";
import { Goal } from "./src/entities/goal.entity.js";
import { WishlistItem } from "./src/entities/wishlist-item.entity.js";

const isDirect = process.env.DB_CONNECTION_MODE === "direct";
const cloudUrl = isDirect ? process.env.DIRECT_URL : process.env.DATABASE_URL;

if (isDirect && !cloudUrl) {
  throw new Error("DIRECT_URL is required for cloud database migrations");
}

const localPassword = process.env.DB_PASSWORD;
if (!cloudUrl && !localPassword) {
  throw new Error(
    "Set DATABASE_URL for Neon or DB_PASSWORD for local PostgreSQL",
  );
}

const entities = [Task, User, Goal, WishlistItem];

const config = cloudUrl
  ? defineConfig({
      entities,
      clientUrl: cloudUrl,
      driverOptions: {
        ssl: true,
      },
      pool: { min: 0, max: 2 },
      migrations: { path: "./src/migrations" },
    })
  : defineConfig({
      entities,
      dbName: "taskflow",
      host: "localhost",
      port: 5432,
      user: "taskflow",
      password: localPassword!,
      migrations: { path: "./src/migrations" },
    });

export default config;

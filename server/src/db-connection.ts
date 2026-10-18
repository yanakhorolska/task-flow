import "reflect-metadata";
import { MikroORM } from "@mikro-orm/postgresql";
import config from "../mikro-orm.config.js";

export const connectDB = async () => {
  const orm = await MikroORM.init(config);

  console.log("PostgreSQL connected!");
  return orm;
};

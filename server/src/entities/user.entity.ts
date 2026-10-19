import { randomUUID } from "node:crypto";
import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import type { Opt } from "@mikro-orm/core";

@Entity({ tableName: "users" })
export class User {
  @PrimaryKey({ type: "uuid" })
  id: Opt<string> = randomUUID();

  @Property({ type: "string" })
  name!: string;

  @Property({ type: "string", unique: true })
  email!: string;

  @Property({ type: "string", nullable: true, hidden: true })
  passwordHash: string | null = null;

  @Property({ type: "string", nullable: true })
  avatarUrl: string | null = null;

  @Property({ type: "Date", nullable: true })
  birthDate: Date | null = null;

  @Property({ type: "text", nullable: true })
  bio: string | null = null;

  @Property({ type: "string", default: "system" })
  theme: Opt<"light" | "dark" | "system"> = "system";

  @Property({ type: "string", default: "Europe/Warsaw" })
  timezone: Opt<string> = "Europe/Warsaw";

  @Property({ type: "string", default: "monday" })
  weekStartsOn: Opt<"monday" | "sunday"> = "monday";

  @Property({ type: "Date" })
  createdAt: Opt<Date> = new Date();

  @Property({ type: "Date", onUpdate: () => new Date() })
  updatedAt: Opt<Date> = new Date();

  @Property({ type: "string", default: "user" })
  role: Opt<"user" | "admin"> = "user";

}

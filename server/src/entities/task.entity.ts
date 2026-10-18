import { randomUUID } from "node:crypto";
import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import type { Opt } from "@mikro-orm/core";

@Entity({ tableName: "tasks" })
export class Task {
  @PrimaryKey({ type: "uuid" })
  id: Opt<string> = randomUUID();

  @Property({ type: "string" })
  title!: string;

  @Property({ type: "string", nullable: true })
  description?: string;

  @Property({ type: "string", default: "todo" })
  status: Opt<"todo" | "in-progress" | "done"> = "todo";

  @Property({ type: "string", default: "medium" })
  priority: Opt<"low" | "medium" | "high"> = "medium";

  @Property({ type: "Date" })
  createdAt: Opt<Date> = new Date();

  @Property({ type: "Date", nullable: true })
  dueDate?: Date;
}

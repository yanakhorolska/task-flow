import { randomUUID } from "node:crypto";
import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/decorators/legacy";
import type { Opt } from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity({ tableName: "wishlist_items" })
export class WishlistItem {
  @PrimaryKey({ type: "uuid" }) id: Opt<string> = randomUUID();
  @Property({ type: "string" }) title!: string;
  @Property({ type: "boolean", default: false }) completed: Opt<boolean> = false;
  @Property({ type: "Date" }) createdAt: Opt<Date> = new Date();
  @ManyToOne(() => User) user!: User;
}

import { Migration } from "@mikro-orm/migrations";

export class Migration20261018133807 extends Migration {
  override name = "Migration20261018133807";

  override up(): void | Promise<void> {
    this.addSql(
      `create table "tasks" ("id" uuid not null, "title" varchar(255) not null, "description" varchar(255) null, "status" varchar(255) not null default 'todo', "priority" varchar(255) not null default 'medium', "created_at" timestamptz not null, "due_date" timestamptz null, primary key ("id"));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "tasks" cascade;`);
  }
}

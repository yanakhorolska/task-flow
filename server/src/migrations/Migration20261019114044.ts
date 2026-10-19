import { Migration } from '@mikro-orm/migrations';

export class Migration20261019114044 extends Migration {

  override name = 'Migration20261019114044';

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password_hash" varchar(255) null, "avatar_url" varchar(255) null, "bio" text null, "theme" varchar(255) not null default 'system', "timezone" varchar(255) not null default 'Europe/Warsaw', "week_starts_on" varchar(255) not null default 'monday', "created_at" timestamptz not null, "updated_at" timestamptz not null, "role" varchar(255) not null default 'user', primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`alter table "tasks" add "user_id" uuid null;`);
    this.addSql(`alter table "tasks" add constraint "tasks_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "tasks" drop constraint "tasks_user_id_foreign";`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`alter table "tasks" drop column "user_id";`);
  }

}

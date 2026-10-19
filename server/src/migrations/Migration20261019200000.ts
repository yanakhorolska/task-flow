import { Migration } from "@mikro-orm/migrations";
export class Migration20261019200000 extends Migration {
  override up(): void {
    this.addSql('create table "goals" ("id" uuid not null, "title" varchar(255) not null, "completed" boolean not null default false, "created_at" timestamptz not null, "user_id" uuid not null, constraint "goals_pkey" primary key ("id"));');
    this.addSql('alter table "goals" add constraint "goals_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete cascade;');
    this.addSql('create table "wishlist_items" ("id" uuid not null, "title" varchar(255) not null, "completed" boolean not null default false, "created_at" timestamptz not null, "user_id" uuid not null, constraint "wishlist_items_pkey" primary key ("id"));');
    this.addSql('alter table "wishlist_items" add constraint "wishlist_items_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete cascade;');
  }
  override down(): void {
    this.addSql('drop table if exists "wishlist_items" cascade;');
    this.addSql('drop table if exists "goals" cascade;');
  }
}

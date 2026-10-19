import { Migration } from "@mikro-orm/migrations";

export class Migration20261019193000 extends Migration {
  override up(): void {
    this.addSql('alter table "users" add column "birth_date" timestamptz null;');
  }
  override down(): void {
    this.addSql('alter table "users" drop column "birth_date";');
  }
}

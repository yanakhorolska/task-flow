# TaskFlow API deployment (Vercel + Neon)

## Environment

Set these **only** in your Vercel API project (Root Directory: `server`):

- `DATABASE_URL`: Neon **pooled** PostgreSQL connection string, including sslmode=require.
- `JWT_SECRET`: long, randomly generated secret, unique to production.
- `CLIENT_URL`: exact Angular production origin, e.g. `https://taskflow-client.vercel.app` (no trailing slash).

Do not set `DB_CONNECTION_MODE=direct` in Vercel. Never commit `.env`.

The Vercel entry is `src/index.ts`, exporting Express as the default export. Use the Vercel Framework Preset **Express** if offered. The local command is still `npm run dev`.

## Initialize Neon schema (one-time)

In a PowerShell terminal in `server`, with `DIRECT_URL` stored in your local `.env`:

```powershell
$env:DB_CONNECTION_MODE = "direct"
npx mikro-orm migration:up
Remove-Item Env:DB_CONNECTION_MODE
```

This uses `DIRECT_URL` for migrations, instead of the pooled `DATABASE_URL`. Double-check Neon project and branch before migrating. Existing rows in local PostgreSQL are **not** moved by migrations.

If the CLI fails, run `Remove-Item Env:DB_CONNECTION_MODE` before resuming local development. If you use a different terminal, unset the variable using the equivalent syntax.

## Notes

- Keep `DATABASE_URL` and `DIRECT_URL` in local `server/.env` as instructed.
- Check API: `https://<your-api>.vercel.app/health`.
- API connections run lazily per warm function and share a small PostgreSQL connection pool.
- Configure the Angular production API base URL separately before publishing the frontend.

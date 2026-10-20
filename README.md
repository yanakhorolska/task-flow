# TaskFlow

**Full-stack productivity app built with Angular, TypeScript, Express, and PostgreSQL.**

TaskFlow is a personal workspace for managing tasks, goals, and wishlist items. It features authenticated accounts, persistent data, profile management, and a cozy responsive interface.

[**Live app**](https://task-flow-dun-seven-81.vercel.app) · [**API health check**](https://taskflow-api-mu-orcin.vercel.app/health) · [**Source code**](https://github.com/yanakhorolska/task-flow)

## Preview

<img width="1913" height="900" alt="image" src="https://github.com/user-attachments/assets/7a4b6026-4c59-4898-a4a6-e92d69d7bbe0" />
<img width="1905" height="913" alt="image" src="https://github.com/user-attachments/assets/072f88dd-83ae-4f15-a133-186ba7ce45cd" />
<img width="1902" height="901" alt="image" src="https://github.com/user-attachments/assets/7b81d15c-936b-4b71-8368-7b517f4f71de" />

## TEST USER

- Aa123456!
- example@test.com

## Features

- **Authentication:** registration, login, JWT-protected requests and routes.
- **Task management:** create, view, edit, delete, prioritize, schedule, and update task status.
- **Goals and wishlist:** manage personal items and mark them completed.
- **Profile:** update personal details and view task-completion progress.
- **Validation and feedback:** Angular form validation, inline field errors, API error messages, and Zod validation on the server.
- **Data isolation:** user-scoped resources backed by PostgreSQL.

## Technology

| Area | Stack |
| --- | --- |
| Frontend | Angular 22, TypeScript, SCSS, Angular Signals, RxJS, Reactive Forms |
| Backend | Node.js, Express 5, TypeScript, Zod |
| Database | PostgreSQL, MikroORM 7, Neon |
| Auth | JWT, Argon2 password hashing |
| Tests | Jest, Supertest, SWC |
| Hosting | Vercel (client and API), Neon (database) |

## Architecture

```text
task-flow/
├── client/
│   └── src/
│       ├── app/
│       │   ├── components/  # Reusable UI and layout
│       │   ├── guards/      # Route protection
│       │   ├── models/      # TypeScript models
│       │   ├── pages/       # Routed screens
│       │   ├── services/    # API calls, auth and state
│       │   ├── app.config.ts
│       │   └── app.routes.ts
│       └── environments/
├── server/
│   ├── src/
│   │   ├── controllers/ # Request / response handling
│   │   ├── entities/    # Database entities
│   │   ├── middleware/  # Authentication and errors
│   │   ├── migrations/
│   │   ├── repositories/ # Persistence
│   │   ├── routes/      # Express routers
│   │   ├── schemas/     # Zod validation
│   │   ├── services/    # Business operations
│   │   ├── tests/       # HTTP integration tests
│   │   ├── utils/
│   │   ├── app.ts       # Production router wiring
│   │   ├── create-app.ts # Express app factory (testable via DI)
│   │   ├── index.ts     # Vercel entry
│   │   └── server.ts    # Local entry
│   ├── jest.config.cjs
│   └── mikro-orm.config.ts
└── README.md
```

**Request lifecycle:** Angular pages → services / HTTP interceptor → Express routes → JWT middleware → controllers / Zod schemas → services or repositories → MikroORM → PostgreSQL.

The Express app factory accepts its router provider as a dependency, allowing selected HTTP tests to run without a real database connection.

## API

Local base URL: `http://localhost:3000`. Protected endpoints require `Authorization: Bearer <access_token>`.

| Method | Endpoint | Action | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Health status | No |
| POST | `/auth/register` | Register | No |
| POST | `/auth/login` | Login and get access token | No |
| GET | `/users/me` | Current user and progress | Yes |
| PATCH | `/users/me` | Update profile | Yes |
| GET | `/tasks` | List personal tasks | Yes |
| GET | `/tasks/:id` | Get task | Yes |
| POST | `/tasks` | Create task | Yes |
| PATCH | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |
| GET / POST | `/goals`, `/wishlist` | List / create items | Yes |
| PATCH / DELETE | `/goals/:id`, `/wishlist/:id` | Update completion / delete | Yes |

Example create-task request:

```http
POST /tasks
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "title": "Review Angular",
  "description": "Practice Reactive Forms",
  "status": "todo",
  "priority": "high",
  "dueDate": null
}
```

The API returns appropriate HTTP status codes, including `400` for invalid input, `401` for unauthenticated access, `404` for missing resources and `409` for duplicate email registration.

## Running locally

### Requirements

- Node.js and npm compatible with Angular 22 and the installed dependencies
- A PostgreSQL database (local or hosted)
- Database schema initialized using the included MikroORM migrations

### Backend

```bash
git clone https://github.com/yanakhorolska/task-flow.git
cd task-flow/server
npm install
```

Create `server/.env` (never commit real secrets):

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=replace-with-a-strong-random-secret
CLIENT_URL=http://localhost:4200
PORT=3000
```

Alternatively, local PostgreSQL uses `DB_PASSWORD` with the host/database/user defined in `server/mikro-orm.config.ts`. Apply the migrations using the MikroORM CLI configured for your environment.

```bash
npm run dev
```

The API runs at `http://localhost:3000`; `GET /health` returns `{"status":"ok"}`.

### Frontend

In a separate terminal:

```bash
cd task-flow/client
npm install
npm start
```

Open `http://localhost:4200`. The local API URL is configured in `client/src/environments/environment.ts`.

## Testing

Backend tests use **Jest** for unit tests and **Supertest** for HTTP-level integration tests. They cover Zod validation, JWT middleware, Express health checks, and a protected-route behavior test using an injected test router.

```bash
cd server
npm test
npx tsc --noEmit
```

The mocked route test does not exercise the full production task router or PostgreSQL. These tests intentionally cover selected behaviors, not the complete application.

For frontend type checking and a production build:

```bash
cd client
npm run build
```

## Deployment

The frontend and API are deployed separately on Vercel, using Neon PostgreSQL for data persistence. The backend exposes a local Node.js entry point (`server.ts`) and a Vercel entry point (`index.ts`).

## Planned improvements

- OpenAPI 3 documentation and Swagger UI
- GitHub Actions CI for tests, type checking and builds
- Additional API and frontend tests
- Accessibility improvements and expanded error-state coverage

## Author

**Yana Khorolska** · [GitHub](https://github.com/yanakhorolska)

# TaskFlow

TaskFlow is an Angular task-management application built to practice and demonstrate modern Angular patterns in a focused, portfolio-ready project.

The project currently includes task listing, task details, routing, typed task models, reactive form validation, HTTP-based data loading, RxJS flows, and reusable standalone components.

## Features

- View a list of tasks
- Open task details through dynamic routes
- Create tasks through a Reactive Form
- Validate required fields and minimum title length
- Display task status, priority, description, and due date
- Load task data through an Angular service using `HttpClient`
- Handle asynchronous data with RxJS and the `AsyncPipe`
- Reuse a standalone task card component
- Use typed models for task status, priority, and task data

## Angular Concepts Used

This project is intentionally focused on Angular concepts that are commonly expected in frontend roles:

- Standalone components
- Angular Router
- Route parameters
- Dependency Injection with `inject()`
- Reactive Forms
- Form validation
- `HttpClient`
- RxJS `Observable`
- RxJS operators such as `map`, `switchMap`, `tap`, and `catchError`
- `AsyncPipe`
- Angular control flow with `@if` and `@for`
- `@Input` and `@Output`
- Typed TypeScript models
- Component-based feature structure

## Tech Stack

- Angular 22
- TypeScript
- RxJS
- Angular Router
- Reactive Forms
- HttpClient
- SCSS
- Vitest

## Project Structure

```text
src/app
├── app.routes.ts
└── features
    └── tasks
        ├── components
        │   └── task-card
        ├── models
        │   └── task.model.ts
        ├── pages
        │   ├── task-list
        │   ├── task-details
        │   └── task-form
        └── services
            └── task.ts
```

The application is organized by feature rather than by file type at the root level. This keeps task-related components, pages, models, and services grouped together.

## Routes

| Route | Purpose |
| --- | --- |
| `/tasks` | Display all tasks |
| `/tasks/new` | Create a new task |
| `/tasks/:id` | Display details for a selected task |

## Data Model

Each task contains:

```ts
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}
```

## Current Architecture

```text
Angular Components
      ↓
TaskService
      ↓
HttpClient
      ↓
JSON task data
```

The service is responsible for loading task data and exposing it as RxJS Observables to the UI.

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

## Testing

Run the test suite with:

```bash
npm test
```

## Next Improvements

TaskFlow is actively being expanded. The next planned steps are:

- Persist newly created tasks instead of logging form values
- Add edit functionality
- Connect the delete event to application state
- Add filtering by status and priority
- Add task search
- Introduce Angular Signals for local state
- Add loading, empty, and error states
- Expand unit tests for services and components
- Improve responsive UI and accessibility
- Replace static JSON data with a real REST API

## Why This Project

I created TaskFlow to strengthen my Angular skills beyond isolated exercises and build a project that demonstrates how I structure features, routes, forms, services, and asynchronous data flows in a real application.

---

**Author:** Yana Khorolska

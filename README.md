# Task Management App

A production-ready task management application built with React, Vite, TypeScript, Redux Toolkit, Tailwind CSS, MSW, and Vitest.

## Features

- Mocked JWT authentication with protected routes
- CRUD task management
- Redux Toolkit state management
- MSW-powered mocked API
- localStorage persistence for auth, tasks, and theme
- Mobile responsive UI
- Dark mode
- Tailwind CSS styling
- Vitest + React Testing Library test coverage
- ESLint + Prettier setup
- Clean feature-based folder architecture

## Tech Stack

- React 18
- Vite
- TypeScript
- Redux Toolkit
- React Router
- MSW
- Tailwind CSS
- Vitest
- React Testing Library
- ESLint
- Prettier

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app:

```text
http://127.0.0.1:5173/
```

## Demo Login

```text
Email: test@example.com
Password: test123
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm test
```

Runs Vitest with coverage.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run format
```

Formats files with Prettier.

## Project Structure

```text
src/
  app/
    hooks.ts
    store.ts
  features/
    auth/
    tasks/
    theme/
  mocks/
    browser.ts
    data.ts
    handlers.ts
    server.ts
  routes/
    ProtectedRoute.tsx
  shared/
    api/
    storage.ts
  styles/
    index.css
  test/
    render.tsx
    setup.ts
```

## API Mocking

The app uses MSW to mock backend endpoints:

- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Task changes are persisted in `localStorage`, so created, edited, and deleted tasks remain after refresh.

## Testing

The project includes tests for:

- Authentication flow
- Protected routes
- Task create, edit, delete, and filter flows
- Theme toggling
- Redux slices
- API client behavior
- localStorage helpers

Coverage thresholds are configured at 100% for statements, branches, functions, and lines.

## Notes

Do not open `dist/index.html` directly in the browser. Use:

```bash
npm run dev
```

or:

```bash
npm run build
npm run preview
```

This is required because the app uses routing and MSW service worker mocking.

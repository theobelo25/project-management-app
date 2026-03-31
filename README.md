# Project Management App

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black)
![NestJS](https://img.shields.io/badge/NestJS-Backend-ea2845)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220)
![Turbo](https://img.shields.io/badge/Turborepo-monorepo-000000)
![CI](https://github.com/theobelo25/project-management-app/actions/workflows/ci.yml/badge.svg)

A full-stack project management platform built with **Next.js, NestJS, Prisma, and Turborepo**. The repo is a **pnpm workspace** with shared packages (`@repo/database`, `@repo/types`), a modular NestJS API, and a Next.js App Router frontend.

This project is intended as a **production-style portfolio application**: typed APIs, validation, auth cookies, role-aware access, and **automated tests** on the API (Jest) and web app (Vitest, Playwright, Storybook-driven browser tests). **CI** runs lint, typecheck, tests, Storybook Vitest, and production builds (see [.github/workflows/ci.yml](.github/workflows/ci.yml)).

---

## Features

- **Authentication** — JWT access and refresh tokens in **http-only cookies**, Argon2 password hashing, global JWT guard with `@Public()` escape hatch
- **Organizations** — Multi-tenant workspaces with organization roles
- **Projects** — Project membership with **project roles** (owner, admin, member) and settings
- **Tasks** — CRUD, statuses and priorities, **Kanban board** with drag-and-drop (**@dnd-kit**), task detail and list views
- **Notifications** — In-app notification domain
- **API** — REST, **Zod**-validated DTOs (shared with `@repo/types`), global exception handling, **rate limiting**, structured logging (**Pino**)
- **Docs** — **OpenAPI/Swagger** at `/api/docs` when `NODE_ENV` is not `production`
- **Testing** — API: Jest unit tests and **supertest** e2e; Web: **Vitest** (unit + integration), **Playwright** e2e, **Storybook** with Vitest browser projects
- **Monorepo** — Turborepo for `build`, `lint`, `typecheck`, `test`, and `dev`
- **Containers** — `Dockerfile.web` and `Dockerfile.api` at the repository root for deployment

---

## Tech stack

| Area          | Technologies                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| Frontend      | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui (Radix), TanStack Query, Jotai, React Hook Form, Zod |
| Backend       | NestJS, Passport JWT (from cookies), cookie-parser, Terminus (health), Swagger                                 |
| Data          | Prisma ORM, **PostgreSQL**                                                                                     |
| Tooling       | pnpm workspaces, Turborepo, ESLint, Prettier                                                                   |
| Testing       | **API:** Jest (`*.spec.ts`), e2e under `apps/api/test/` — **Web:** Vitest, Testing Library, MSW, Playwright, Storybook |

---

## Monorepo layout

```
project-management-app
├── apps
│   ├── api          # NestJS backend (global prefix `/api`)
│   └── web          # Next.js frontend
├── packages
│   ├── database     # Prisma schema + generated client (`@repo/database`)
│   └── types        # Shared Zod schemas and types (`@repo/types`)
├── Dockerfile.api
├── Dockerfile.web
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

| Package          | Role                                        |
| ---------------- | ------------------------------------------- |
| `@repo/database` | Prisma schema, migrations, client export    |
| `@repo/types`    | Shared validation and types for API and web |

---

## Prerequisites

- **Node.js** 20+ (CI currently uses Node 25; align locally if you hit version-specific issues)
- **pnpm** (see [packageManager](package.json) for the version used in this repo)
- **PostgreSQL** (local or hosted) for Prisma
- **Git**

---

## Installation

Clone the repository (use your fork or remote URL):

```bash
git clone <your-repo-url>
cd project-management-app
pnpm install
```

---

## Environment variables

Configuration is split between the **API**, the **web** app, and **Prisma** (database package).

**Templates** (copy and rename):

| Template                                                         | Copy to                  |
| ---------------------------------------------------------------- | ------------------------ |
| [apps/api/.env.example](apps/api/.env.example)                   | `apps/api/.env`          |
| [apps/web/.env.example](apps/web/.env.example)                   | `apps/web/.env.local`    |
| [packages/database/.env.example](packages/database/.env.example) | `packages/database/.env` |

Use the same `DATABASE_URL` / database name and credentials in `apps/api/.env` and `packages/database/.env` for local development.

### API (`apps/api/.env`)

The API validates env at startup (`apps/api/src/config/env.validation.ts`). Create `apps/api/.env` with at least:

| Variable                         | Description                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `NODE_ENV`                       | e.g. `development` or `production`                                                 |
| `APP_PORT`                       | HTTP port (default `3333` if omitted in schema — still set explicitly in practice) |
| `APP_HOST`                       | Bind host (default `0.0.0.0`)                                                      |
| `FRONTEND_ORIGIN`                | Primary frontend origin (used for app logic; align with your Next.js URL)          |
| `CORS_ORIGINS`                   | Allowed CORS origins, **comma-separated** (trimmed; see `getCorsOptions`)          |
| `COOKIE_DOMAIN`                  | Optional; set in production for cookies across subdomains                          |
| `DATASOURCE_USERNAME`            | PostgreSQL user                                                                    |
| `DATASOURCE_PASSWORD`            | PostgreSQL password                                                                |
| `DATASOURCE_HOST`                | PostgreSQL host                                                                    |
| `DATASOURCE_PORT`                | PostgreSQL port                                                                    |
| `DATASOURCE_DATABASE`            | Database name                                                                      |
| `DATABASE_URL`                   | Prisma connection string (PostgreSQL)                                              |
| `JWT_SECRET`                     | Secret for signing JWTs                                                            |
| `JWT_ACCESS_TOKEN_EXPIRATION_MS` | Access token lifetime (ms)                                                         |
| `REFRESH_TOKEN_EXPIRATION_MS`    | Refresh token lifetime (ms)                                                        |
| `JWT_ISSUER`                     | JWT `iss`                                                                          |
| `JWT_AUDIENCE`                   | JWT `aud`                                                                          |

### Web (`apps/web/.env.local`)

| Variable              | Required | Description                                                                |
| --------------------- | -------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Yes      | Public origin of the API (no trailing slash), e.g. `http://localhost:3333` |
| `NEXT_PUBLIC_APP_URL` | No       | Site URL; defaults to `http://localhost:3000` in layout if unset           |

---

## Database

From the repository root:

```bash
pnpm db:generate
pnpm db:migrate
```

Or using the database package directly:

```bash
pnpm --filter @repo/database exec prisma generate
pnpm --filter @repo/database exec prisma migrate dev
```

Open Prisma Studio:

```bash
pnpm db:studio
```

---

## Development

Start **all** apps (via Turborepo):

```bash
pnpm dev
```

Start individually:

```bash
pnpm --filter web dev    # Next.js — http://localhost:3000
pnpm --filter api dev    # NestJS — default port from APP_PORT (e.g. 3333)
```

With the API running in non-production mode, OpenAPI UI is available at **`http://<api-host>:<port>/api/docs`**.

---

## Scripts (root)

| Command                     | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                  | Run dev tasks for workspace packages                                        |
| `pnpm build`                | Production build (Turbo)                                                  |
| `pnpm lint`                 | ESLint across packages                                                      |
| `pnpm typecheck`            | TypeScript checks                                                           |
| `pnpm test`                 | Workspace tests via Turbo (API Jest + web Vitest unit/integration)        |
| `pnpm db:generate`          | `prisma generate` in `@repo/database`                                       |
| `pnpm db:migrate`           | `prisma migrate dev` in `@repo/database`                                    |
| `pnpm db:studio`            | Prisma Studio                                                               |
| `pnpm web:test`             | Web Vitest (unit + integration)                                             |
| `pnpm web:test-unit`        | Web unit tests only                                                         |
| `pnpm web:test-integration` | Web integration tests only                                                  |
| `pnpm web:test-storybook`   | Storybook Vitest browser project (needs Chromium; see below)              |
| `pnpm web:test-e2e`         | Playwright e2e (`apps/web`)                                                 |

### API tests

Run from the repo root:

```bash
pnpm --filter api test       # unit tests
pnpm --filter api test:e2e   # e2e (Jest + supertest)
```

### Web tests

```bash
pnpm web:test                       # Vitest: unit + integration
pnpm web:test-storybook             # Storybook + Vitest (install browser first)
pnpm --filter web test:e2e:install  # one-time Playwright Chromium for e2e
pnpm web:test-e2e                   # Playwright e2e
```

For Storybook Vitest (and CI), Chromium is installed with:

```bash
pnpm --filter web exec playwright install chromium
```

Local Storybook: `pnpm --filter web storybook` (port 6006).

### CI

On pull requests and pushes to `main`, CI runs `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm --filter web test:storybook` (after installing Chromium), then `pnpm build`. See [.github/workflows/ci.yml](.github/workflows/ci.yml).

---

## Docker

Build and run using the root Dockerfiles (set build args / env such as `DATABASE_URL` as required for your environment). See comments in `Dockerfile.api` and `Dockerfile.web` for workspace-aware build steps.

---

## Future improvements

- **Real-time** — WebSockets or SSE for live task and notification updates
- **Broader e2e coverage** — Expand Playwright flows for critical product paths in CI
- **Analytics** — Project dashboards and reporting

---

## Architecture goals

- Clear **monorepo** boundaries and shared contracts via `@repo/types`
- **NestJS** modules per domain (auth, users, organizations, projects, tasks, notifications)
- **Consistent validation** with Zod end-to-end where schemas are shared
- **Secure defaults** — http-only cookies, throttling, payload size limits, structured errors

---

## License

ISC (see [package.json](package.json)).

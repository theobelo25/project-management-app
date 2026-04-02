# Nudge — project management platform

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![NestJS](https://img.shields.io/badge/NestJS-11-ea2845)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220)
![Turbo](https://img.shields.io/badge/Turborepo-monorepo-000000)
![CI](https://github.com/theobelo25/project-management-app/actions/workflows/ci.yml/badge.svg)

Full-stack **portfolio** application: multi-tenant orgs, projects, tasks, notifications, and **realtime** updates. The UI ships as **Nudge** (see [`apps/web` metadata](apps/web/src/app/layout.tsx)); this repository is the **pnpm + Turborepo** workspace that powers it.

**What this demonstrates:** end-to-end TypeScript, shared **Zod** contracts (`@repo/types`), **Prisma** + PostgreSQL, **NestJS** domain modules with guards and policies, **Next.js App Router** with TanStack Query and cookie-aware auth, **Socket.IO** realtime, and a **CI** pipeline (lint, typecheck, tests, Storybook Vitest, production builds).

---

## Highlights

| Area | Notes |
| ---- | ----- |
| **Auth** | JWT access + refresh in **http-only cookies**, Argon2, Nest global JWT guard with `@Public()` |
| **Data** | Prisma 7, PostgreSQL; **Docker Compose** for a one-command local DB (`pnpm db:up`) |
| **API** | REST, Zod DTOs, rate limiting, Pino logging, OpenAPI at `/api/docs` in development |
| **UI** | shadcn/Radix, Kanban (**@dnd-kit**), **calendar** with due dates and **mobile agenda** view, responsive board (horizontal scroll on small viewports) |
| **Quality** | API Jest + supertest e2e; web Vitest (unit/integration), Playwright e2e, Storybook + Vitest browser tests |

---

## Features

- **Authentication** — Cookie-based JWT sessions, Argon2 passwords, refresh rotation
- **Organizations** — Multi-tenant workspaces and organization roles
- **Projects** — Membership, project roles (owner / admin / member), settings
- **Tasks** — CRUD, statuses, priorities, label colors; **Kanban board** with drag-and-drop; list and detail views
- **Calendar** — Month grid with tasks by due date; **below `md`**, a scrollable **agenda** list (same drag-to-reschedule behavior where enabled)
- **Notifications** — In-app notifications for assignments, updates, membership, and role changes
- **Realtime** — Socket.IO for live notifications, invites, tasks, and membership updates
- **Docs & tooling** — Swagger UI, Turborepo tasks, Dockerfiles for **web**, **API**, and **local Postgres**

---

## Tech stack

| Layer | Stack |
| ----- | ----- |
| **Web** | Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui (Radix), TanStack Query, Jotai, React Hook Form, Zod, Socket.IO client |
| **API** | NestJS 11, Passport JWT (from cookies), cookie-parser, Swagger, Terminus, **nestjs-zod**, Throttler, **Socket.IO** gateway |
| **Data** | Prisma 7, PostgreSQL (`@prisma/adapter-pg`) |
| **Shared** | `@repo/types` (Zod schemas), `@repo/database` (schema + client) |
| **Tooling** | pnpm 10 workspaces, Turborepo, ESLint, Prettier, TypeScript 5.8 |

---

## Monorepo layout

```
project-management-app
├── apps
│   ├── api          # NestJS API (global prefix `/api`)
│   └── web          # Next.js frontend (“Nudge”)
├── packages
│   ├── database     # Prisma schema, migrations, `@repo/database`
│   └── types        # Shared Zod schemas and types (`@repo/types`)
├── Dockerfile.api
├── Dockerfile.postgres   # local dev PostgreSQL
├── Dockerfile.web
├── docker-compose.yml    # `postgres` service for development
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

**Backend layout** — Feature-oriented folders under `apps/api/src/domain/`. The tasks module is a good reference for use cases, repository ports, and access policies. See **[apps/api/README.md — API architecture](apps/api/README.md#api-architecture-reference-domain)**.

---

## Prerequisites

- **Node.js** 20+ (CI uses **Node 25**)
- **pnpm** — version pinned in [package.json](package.json) (`packageManager`); CI uses **10.30.3**
- **PostgreSQL** — [Docker](#database) (`pnpm db:up`), a local install, or any hosted instance compatible with the Prisma schema
- **Docker** (optional) — Recommended for the quickest local database
- **Git**

---

## Quick start (local)

```bash
git clone <your-repo-url>
cd project-management-app
pnpm install

# Start PostgreSQL (Docker)
pnpm db:up

# Env files — copy templates, then align DATABASE_URL in both API + database packages
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp packages/database/.env.example packages/database/.env

pnpm db:generate
pnpm db:migrate

pnpm dev
```

- **Web:** [http://localhost:3000](http://localhost:3000)  
- **API:** port from `APP_PORT` in `apps/api/.env` (commonly **3333**)  
- **OpenAPI:** `http://localhost:<port>/api/docs` when `NODE_ENV` is not `production`

---

## Environment variables

Copy from the templates:

| Template | Destination |
| -------- | ----------- |
| [apps/api/.env.example](apps/api/.env.example) | `apps/api/.env` |
| [apps/web/.env.example](apps/web/.env.example) | `apps/web/.env.local` |
| [packages/database/.env.example](packages/database/.env.example) | `packages/database/.env` |

Use the **same** `DATABASE_URL` (and matching `DATASOURCE_*` in the API) in `apps/api/.env` and `packages/database/.env`.

### API (`apps/api/.env`)

Validated at startup (`apps/api/src/config/env.validation.ts`). Key variables:

| Variable | Purpose |
| -------- | ------- |
| `NODE_ENV`, `APP_PORT`, `APP_HOST` | Runtime |
| `FRONTEND_ORIGIN`, `CORS_ORIGINS` | CORS and app origin |
| `COOKIE_DOMAIN` | Optional; production cookie scope |
| `DATASOURCE_*`, `DATABASE_URL` | PostgreSQL / Prisma |
| `JWT_*`, `REFRESH_TOKEN_EXPIRATION_MS` | Tokens |
| `REALTIME_ENABLED` | Socket gateway |

Full list and defaults: [apps/api/.env.example](apps/api/.env.example).

### Web (`apps/web/.env.local`)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `NEXT_PUBLIC_API_URL` | Yes | API origin, no trailing slash (e.g. `http://localhost:3333`) |
| `NEXT_PUBLIC_REALTIME_ENABLED` | No | Socket client |
| `NEXT_PUBLIC_APP_URL` | No | Site URL (layout default `http://localhost:3000`) |

---

## Database

### Docker (recommended for development)

From the repo root:

```bash
pnpm db:up          # docker compose up -d postgres
pnpm db:down        # docker compose down (volume persists)
```

Image: [Dockerfile.postgres](Dockerfile.postgres) · Compose: [docker-compose.yml](docker-compose.yml).

Defaults: user `postgres`, password `postgres`, database `project_management`, host port **5432**. If **5432** is taken, change the port mapping in `docker-compose.yml` and update `DATABASE_URL` / `DATASOURCE_PORT`.

### Migrations & Studio

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

Equivalent with an explicit filter:

```bash
pnpm --filter @repo/database exec prisma migrate dev
```

---

## Development

```bash
pnpm dev                    # Turbo: web + api (+ packages as configured)
pnpm --filter web dev       # Next.js — http://localhost:3000
pnpm --filter api dev       # NestJS — watch mode
```

---

## Scripts (root)

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Development (Turbo) |
| `pnpm build` | Production builds |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Turbo tests (API Jest + web Vitest unit/integration) |
| `pnpm db:generate` | `prisma generate` |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:studio` | Prisma Studio |
| `pnpm db:up` / `pnpm db:down` | Local Postgres via Compose |
| `pnpm web:test` | Web Vitest (unit + integration) |
| `pnpm web:test-unit` | Web unit only |
| `pnpm web:test-integration` | Web integration only |
| `pnpm web:test-storybook` | Storybook Vitest (needs Chromium) |
| `pnpm web:test-e2e` | Playwright |

### API tests

```bash
pnpm --filter api test
pnpm --filter api test:e2e
```

### Web tests & Storybook

```bash
pnpm web:test
pnpm --filter web exec playwright install chromium   # Storybook Vitest / e2e setup
pnpm web:test-storybook
pnpm --filter web test:e2e:install
pnpm web:test-e2e
pnpm --filter web storybook   # http://localhost:6006
```

---

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on **pull requests** and on **pushes to `main`**:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint` → `pnpm typecheck` → `pnpm test`
3. Install Playwright Chromium → `pnpm --filter web test:storybook`
4. `pnpm build`

`DATABASE_URL` and `NEXT_PUBLIC_API_URL` are set to **placeholders** for build-time codegen; migrations are not applied in CI.

---

## Docker (deployment)

| Artifact | Role |
| -------- | ---- |
| [Dockerfile.postgres](Dockerfile.postgres) + [docker-compose.yml](docker-compose.yml) | **Local** PostgreSQL |
| [Dockerfile.api](Dockerfile.api), [Dockerfile.web](Dockerfile.web) | **Production-style** API and web images (set `DATABASE_URL` and related env at run time; see comments in each file) |

---

## Roadmap (ideas)

- Deeper Playwright coverage for realtime and role-sensitive flows
- Richer dashboards / analytics
- Further mobile polish across project views

---

## Architecture principles

- **Monorepo contracts** — Shared validation and types via `@repo/types`
- **Domain modules** — NestJS boundaries for auth, users, organizations, projects, tasks, notifications
- **Secure defaults** — Http-only cookies, throttling, payload limits, structured errors

---

## License

ISC — see [package.json](package.json).

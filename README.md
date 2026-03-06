# Project Management App

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black)
![NestJS](https://img.shields.io/badge/NestJS-Backend-ea2845)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220)
![Turbo](https://img.shields.io/badge/Turborepo-monorepo-000000)

A full-stack project management platform built with **Next.js, NestJS, Prisma, and Turborepo**.
The application is designed using a **modern TypeScript monorepo architecture** with shared packages, scalable backend design, and a modular frontend.

This project is intended as a **production-style portfolio application**, demonstrating real-world architecture patterns such as workspace packages, shared types, and service-based backend design.

---

# Features

- Project and task management
- Kanban-style task boards
- Scalable backend API with NestJS
- Shared database client using Prisma
- Monorepo architecture with pnpm workspaces
- Turborepo task orchestration and caching
- Shared TypeScript packages
- Modern Next.js App Router frontend

Planned features include:

- Real-time task updates
- Drag-and-drop Kanban board
- User authentication and session management
- Team collaboration features
- Activity history and notifications

---

# Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- REST API architecture

### Database

- Prisma ORM
- SQLite (development)
- PostgreSQL (production-ready)

### Monorepo Tooling

- pnpm workspaces
- Turborepo
- Shared TypeScript packages

---

# Monorepo Architecture

This project uses a **pnpm workspace monorepo** to share code between applications.

```
project-management-app
│
├── apps
│   ├── api        # NestJS backend
│   └── web        # Next.js frontend
│
├── packages
│   ├── database   # Prisma client + schema
│   └── types      # Shared TypeScript types
│
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

### Apps

| App   | Description        |
| ----- | ------------------ |
| `web` | Next.js frontend   |
| `api` | NestJS backend API |

### Packages

| Package          | Description                              |
| ---------------- | ---------------------------------------- |
| `@repo/database` | Prisma schema and database client        |
| `@repo/types`    | Shared TypeScript types used across apps |

---

# Getting Started

## Prerequisites

- Node.js 20+
- pnpm
- Git

Install pnpm if needed:

```
npm install -g pnpm
```

---

# Installation

Clone the repository:

```
git clone https://github.com/yourusername/project-management-app.git
cd project-management-app
```

Install dependencies:

```
pnpm install
```

---

# Environment Variables

Create a `.env` file in the repository root.

Example:

```
DATABASE_URL="file:./prisma/dev.db"
```

---

# Database Setup

Generate the Prisma client:

```
pnpm --filter @repo/database db:generate
```

Create the development database:

```
pnpm --filter @repo/database db:push
```

Open Prisma Studio:

```
pnpm --filter @repo/database db:studio
```

---

# Development

Start all services:

```
pnpm dev
```

Start individual apps:

Frontend:

```
pnpm --filter web dev
```

Backend:

```
pnpm --filter api dev
```

---

# Scripts

| Command          | Description           |
| ---------------- | --------------------- |
| `pnpm dev`       | Start all apps        |
| `pnpm build`     | Build all packages    |
| `pnpm lint`      | Run linting           |
| `pnpm typecheck` | Run TypeScript checks |

---

# Future Improvements

- Real-time task updates with WebSockets
- Drag-and-drop Kanban board
- Role-based access control
- Project analytics and dashboards
- Automated testing
- CI/CD pipeline

---

# Architecture Goals

This project focuses on demonstrating:

- Clean monorepo architecture
- Shared code across frontend and backend
- Scalable NestJS backend design
- Strong TypeScript typing across the stack
- Maintainable and modular project structure

---

# License

MIT License

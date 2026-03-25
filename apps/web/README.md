# Web (`apps/web`)

Next.js **App Router** frontend for the project management monorepo.

## Role in the monorepo

This app is the browser UI. It talks to the NestJS API using **`NEXT_PUBLIC_API_URL`** (see [public-api-url.ts](src/lib/api/public-api-url.ts)). Shared request/response shapes and Zod schemas live in **`@repo/types`**.

Copy [`.env.example`](.env.example) to **`.env.local`** and set `NEXT_PUBLIC_API_URL` to your API origin (no trailing slash).

For full setup, environment variables, database steps, and running the stack, see the **[repository root README](../../README.md)**.

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Next.js dev server (default [http://localhost:3000](http://localhost:3000)) |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm shadcn` | shadcn CLI |

Run these from the monorepo root with a filter:

```bash
pnpm --filter web dev
```

## Stack highlights

- React 19, Next.js 16, TypeScript
- Tailwind CSS, shadcn/ui, Radix
- TanStack Query, React Hook Form, Zod
- `@dnd-kit` for Kanban drag-and-drop

# API (`apps/api`)

**NestJS** HTTP API for the project management monorepo. Global route prefix: **`/api`**.

## Role in the monorepo

- **Persistence** via Prisma through **`@repo/database`**
- **Shared validation and types** via **`@repo/types`** (Zod + `ZodValidationPipe`)
- **Auth**: JWT in http-only cookies (access + refresh), Passport strategies, Argon2 hashing
- **Cross-cutting**: global JWT guard (with `@Public()`), throttling, Pino logging, global exception filter, OpenAPI in non-production

For environment variables, PostgreSQL setup, and running the full stack, see the **[repository root README](../../README.md)**.

## API architecture (reference domain)

The **`tasks`** domain under [`src/domain/tasks/`](src/domain/tasks/) is the main **portfolio-style reference** for how a non-trivial Nest module is structured: clear boundaries, testable units, and side effects separated from core writes.

- **HTTP edge** — Zod-backed DTOs from `@repo/types`; controllers map DTOs to **application commands** before calling the application layer (transport ≠ use case inputs).
- **Application layer** — **Use case** classes orchestrate one operation each (create, update, assign, …); a thin **façade** (`TasksService`) wires them for the controller and tests.
- **Persistence** — `TasksRepository` is an abstract port; the Prisma implementation maps persistence rows to **domain entities** before returning, so application code does not depend on Prisma models.
- **Authorization** — Enforced at the HTTP boundary via **`TaskAccessGuard`** + **`TaskAccessService`**; **`TaskAccessRules`** holds pure, unit-tested policy predicates (no I/O).
- **Reactions to state changes** — **`TaskDomainEventPublisher`** emits domain-shaped events after successful writes; **`@OnEvent` handlers** handle notifications and realtime. The global **`EventEmitterModule`** is registered once in **`AppModule`** (not per feature module).
- **Other domains** — e.g. **projects** already split commands/queries and repository ports; **users** stays intentionally thinner until complexity grows.

## Local configuration

Place a **`.env`** file in **`apps/api/`** (loaded by `ConfigModule`). Copy [`.env.example`](.env.example) as a starting point. All variables are validated at startup — see [env.validation.ts](src/config/env.validation.ts).

In **development**, OpenAPI/Swagger is served at **`/api/docs`** (see [main.ts](src/main.ts)).

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | `nest start --watch` |
| `pnpm build` | Compile to `dist/` |
| `pnpm start` | Run `node dist/main.js` |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` (build project) |
| `pnpm test` | Jest unit tests (`*.spec.ts`) |
| `pnpm test:e2e` | Jest e2e tests in `test/` |

From the monorepo root:

```bash
pnpm --filter api dev
pnpm --filter api test
pnpm --filter api test:e2e
```

## Further reading

- [NestJS documentation](https://docs.nestjs.com)
- Root README for **CORS** (`FRONTEND_ORIGIN`, `CORS_ORIGINS`) and cookie domain notes

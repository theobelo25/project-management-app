# API (`apps/api`)

**NestJS** HTTP API for the project management monorepo. Global route prefix: **`/api`**.

## Role in the monorepo

- **Persistence** via Prisma through **`@repo/database`**
- **Shared validation and types** via **`@repo/types`** (Zod + `ZodValidationPipe`)
- **Auth**: JWT in http-only cookies (access + refresh), Passport strategies, Argon2 hashing
- **Cross-cutting**: global JWT guard (with `@Public()`), throttling, Pino logging, global exception filter, OpenAPI in non-production

For environment variables, PostgreSQL setup, and running the full stack, see the **[repository root README](../../README.md)**.

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

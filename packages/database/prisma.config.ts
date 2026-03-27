import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go from packages/database -> repo root
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// `prisma generate` does not connect; `env("DATABASE_URL")` fails in CI when the var is unset.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://127.0.0.1:5432/prisma_generate_placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});

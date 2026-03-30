import path from "node:path";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Same file Prisma CLI uses (prisma.config.ts). `import "dotenv/config"` only reads cwd `.env`
// (e.g. apps/api), so migrate can target a different DB than this client.
const databasePackageEnv = path.resolve(__dirname, "../../.env");
dotenv.config({ path: databasePackageEnv });
dotenv.config({ path: path.join(process.cwd(), ".env") });

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "../generated/prisma/client";

import { Prisma, PrismaClient } from '@repo/database';

export type Db = Prisma.TransactionClient | PrismaClient;

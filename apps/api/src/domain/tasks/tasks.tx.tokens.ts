import type { InjectionToken } from '@nestjs/common';
import type { Prisma } from '@repo/database';
import type {
  TasksRepositoryTx,
  TasksRepositoryTxFactory,
} from './repositories/tasks.repository';

export const TASKS_REPOSITORY_TX_FACTORY: InjectionToken<TasksRepositoryTxFactory> =
  Symbol('TASKS_REPOSITORY_TX_FACTORY');

export type { TasksRepositoryTx, Prisma };

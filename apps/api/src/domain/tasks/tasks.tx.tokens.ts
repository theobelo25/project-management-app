import type { InjectionToken } from '@nestjs/common';
import type {
  TasksRepositoryTx,
  TasksRepositoryTxFactory,
} from './repositories/tasks.repository';

/**
 * Function-typed factory: no single class token; pair with `useFactory` in `TasksModule`.
 *
 * Task writes are already atomic at the Prisma call level (e.g. `task.create` with nested
 * assignees, `assignUser` wrapped in `$transaction`). Use this factory when a future flow
 * must compose multiple repository operations in one database transaction.
 */
export const TASKS_REPOSITORY_TX_FACTORY: InjectionToken<TasksRepositoryTxFactory> =
  Symbol('TASKS_REPOSITORY_TX_FACTORY');

export type { TasksRepositoryTx };

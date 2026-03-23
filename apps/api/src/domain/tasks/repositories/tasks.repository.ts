import {
  CreateTaskInput,
  UpdateTaskInput,
  FindTasksInput,
  PaginatedTasksResult,
  TaskWithAssignees,
  TaskAccessContext,
  TaskAssignmentResult,
} from '../types/tasks.repository.types';
import type { Prisma } from '@repo/database';

export abstract class TasksRepository {
  abstract create(data: CreateTaskInput): Promise<TaskWithAssignees>;

  abstract update(
    taskId: string,
    data: UpdateTaskInput,
  ): Promise<TaskWithAssignees>;

  abstract findByIdOrThrow(taskId: string): Promise<TaskWithAssignees>;

  abstract findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null>;

  abstract findMany(input: FindTasksInput): Promise<PaginatedTasksResult>;

  abstract delete(taskId: string): Promise<void>;

  abstract assignUser(
    taskId: string,
    userId: string,
  ): Promise<TaskAssignmentResult>;

  abstract unassignUser(taskId: string, userId: string): Promise<number>;

  abstract getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>>;

  abstract findRecentByProjectId(
    projectId: string,
    limit: number,
    orgId: string,
  ): Promise<TaskWithAssignees[]>;
}

export abstract class TasksRepositoryTx {
  abstract create(data: CreateTaskInput): Promise<TaskWithAssignees>;

  abstract update(
    taskId: string,
    data: UpdateTaskInput,
  ): Promise<TaskWithAssignees>;

  abstract findByIdOrThrow(taskId: string): Promise<TaskWithAssignees>;

  abstract findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null>;

  abstract findMany(input: FindTasksInput): Promise<PaginatedTasksResult>;

  abstract delete(taskId: string): Promise<void>;

  abstract assignUser(
    taskId: string,
    userId: string,
  ): Promise<TaskAssignmentResult>;

  abstract unassignUser(taskId: string, userId: string): Promise<number>;

  abstract getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>>;

  abstract findRecentByProjectId(
    projectId: string,
    limit: number,
    orgId: string,
  ): Promise<TaskWithAssignees[]>;
}

export type TasksRepositoryTxFactory = (
  db: Prisma.TransactionClient,
) => TasksRepositoryTx;

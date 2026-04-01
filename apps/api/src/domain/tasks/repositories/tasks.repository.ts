import type {
  TaskEntity,
  TaskAssignmentResultEntity,
} from '../domain/task.entity';
import {
  CreateTaskInput,
  UpdateTaskRepositoryInput,
  FindTasksInput,
  PaginatedTasksResult,
  TaskAccessContext,
} from '../types/tasks.repository.types';

/**
 * Shared contract for root repository and transactional repository implementations.
 * Keeps `TasksRepository` / `TasksRepositoryTx` in sync (DRY).
 */
export interface ITasksRepositoryCore {
  create(data: CreateTaskInput): Promise<TaskEntity>;

  update(taskId: string, data: UpdateTaskRepositoryInput): Promise<TaskEntity>;

  findByIdOrThrow(taskId: string): Promise<TaskEntity>;

  findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null>;

  findMany(input: FindTasksInput): Promise<PaginatedTasksResult>;

  delete(taskId: string): Promise<void>;

  assignUser(
    taskId: string,
    userId: string,
  ): Promise<TaskAssignmentResultEntity>;

  unassignUser(taskId: string, userId: string): Promise<number>;

  getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>>;

  findRecentByProjectId(
    projectId: string,
    limit: number,
    orgId: string,
  ): Promise<TaskEntity[]>;
}

export abstract class TasksRepository implements ITasksRepositoryCore {
  abstract create(data: CreateTaskInput): Promise<TaskEntity>;

  abstract update(
    taskId: string,
    data: UpdateTaskRepositoryInput,
  ): Promise<TaskEntity>;

  abstract findByIdOrThrow(taskId: string): Promise<TaskEntity>;

  abstract findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null>;

  abstract findMany(input: FindTasksInput): Promise<PaginatedTasksResult>;

  abstract delete(taskId: string): Promise<void>;

  abstract assignUser(
    taskId: string,
    userId: string,
  ): Promise<TaskAssignmentResultEntity>;

  abstract unassignUser(taskId: string, userId: string): Promise<number>;

  abstract getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>>;

  abstract findRecentByProjectId(
    projectId: string,
    limit: number,
    orgId: string,
  ): Promise<TaskEntity[]>;
}

export abstract class TasksRepositoryTx implements ITasksRepositoryCore {
  abstract create(data: CreateTaskInput): Promise<TaskEntity>;

  abstract update(
    taskId: string,
    data: UpdateTaskRepositoryInput,
  ): Promise<TaskEntity>;

  abstract findByIdOrThrow(taskId: string): Promise<TaskEntity>;

  abstract findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null>;

  abstract findMany(input: FindTasksInput): Promise<PaginatedTasksResult>;

  abstract delete(taskId: string): Promise<void>;

  abstract assignUser(
    taskId: string,
    userId: string,
  ): Promise<TaskAssignmentResultEntity>;

  abstract unassignUser(taskId: string, userId: string): Promise<number>;

  abstract getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>>;

  abstract findRecentByProjectId(
    projectId: string,
    limit: number,
    orgId: string,
  ): Promise<TaskEntity[]>;
}

export type TasksRepositoryTxFactory = (
  db: unknown,
) => TasksRepositoryTx;

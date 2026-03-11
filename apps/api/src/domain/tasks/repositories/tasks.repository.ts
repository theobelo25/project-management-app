import { Db } from '@api/prisma';
import { Task, TaskAssignee } from '@repo/database';
import {
  CreateTaskInput,
  UpdateTaskInput,
  FindTasksInput,
  PaginatedTasksResult,
  TaskWithAssignees,
} from '../types/tasks.repository.types';
import { TaskAccessContext } from '../types/tasks.repository.types';

export abstract class TasksRepository {
  abstract create(data: CreateTaskInput, db?: Db): Promise<TaskWithAssignees>;

  abstract update(
    taskId: string,
    data: UpdateTaskInput,
    db?: Db,
  ): Promise<TaskWithAssignees>;

  abstract findByIdOrThrow(taskId: string, db?: Db): Promise<TaskWithAssignees>;
  abstract findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null>;

  abstract findMany(
    input: FindTasksInput,
    db?: Db,
  ): Promise<PaginatedTasksResult>;

  abstract delete(taskId: string, db?: Db): Promise<void>;

  abstract assignUser(
    taskId: string,
    userId: string,
    db?: Db,
  ): Promise<TaskAssignee>;

  abstract unassignUser(taskId: string, userId: string, db?: Db): Promise<void>;
}

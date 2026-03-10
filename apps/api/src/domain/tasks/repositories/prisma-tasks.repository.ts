import { Db, PRISMA } from '@api/prisma';
import { PrismaClient, TaskAssignee } from '@repo/database';
import {
  CreateTaskInput,
  TaskWithAssignees,
  UpdateTaskInput,
  FindTasksInput,
  PaginatedTasksResult,
} from '../types/tasks.repository.types';
import { TasksRepository } from './tasks.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  create(data: CreateTaskInput, db?: Db): Promise<TaskWithAssignees> {
    const prisma = db ?? this.prisma;

    return prisma.task.create({
      data,
      include: { assignees: { include: { user: true } } },
    });
  }

  update(
    taskId: string,
    data: UpdateTaskInput,
    db?: Db,
  ): Promise<TaskWithAssignees> {
    throw new Error('Method not implemented.');
  }
  findById(taskId: string, db?: Db): Promise<TaskWithAssignees | null> {
    throw new Error('Method not implemented.');
  }
  findMany(input: FindTasksInput, db?: Db): Promise<PaginatedTasksResult> {
    throw new Error('Method not implemented.');
  }
  delete(taskId: string, db?: Db): Promise<void> {
    throw new Error('Method not implemented.');
  }
  assignUser(taskId: string, userId: string, db?: Db): Promise<TaskAssignee> {
    throw new Error('Method not implemented.');
  }
  unassignUser(taskId: string, userId: string, db?: Db): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

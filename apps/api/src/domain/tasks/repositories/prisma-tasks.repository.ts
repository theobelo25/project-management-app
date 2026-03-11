import { Db, PRISMA } from '@api/prisma';
import { Prisma, PrismaClient, TaskAssignee } from '@repo/database';
import {
  CreateTaskInput,
  TaskWithAssignees,
  UpdateTaskInput,
  FindTasksInput,
  PaginatedTasksResult,
} from '../types/tasks.repository.types';
import { TasksRepository } from './tasks.repository';
import { Inject, Injectable } from '@nestjs/common';
import { buildPaginationResult, getPaginationParams } from '@api/common';

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
    const prisma = db ?? this.prisma;

    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.priority ? { priority: data.priority } : {}),
        ...(data.dueDate ? { dueDate: data.dueDate } : {}),
        ...(data.position ? { position: data.position } : {}),
      },
      include: {
        assignees: { include: { user: true } },
      },
    });
  }

  findById(taskId: string, db?: Db): Promise<TaskWithAssignees | null> {
    const prisma = db ?? this.prisma;

    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: { include: { user: true } },
      },
    });
  }

  async findMany(
    input: FindTasksInput,
    db?: Db,
  ): Promise<PaginatedTasksResult> {
    const prisma = db ?? this.prisma;
    const { skip, take, page, limit } = getPaginationParams(input);

    const where: Prisma.TaskWhereInput = {
      projectId: input.projectId,
      ...(input.status && { status: input.status }),
      ...(input.priority && { priority: input.priority }),
      ...(input.assigneeId && {
        assignees: {
          some: {
            userId: input.assigneeId,
          },
        },
      }),
      ...(input.search && {
        OR: [
          { title: { contains: input.search, mode: 'insensitive' } },
          {
            description: {
              contains: input.search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const findManyArgs = {
      where,
      include: {
        assignees: { include: { user: true } },
      },
      orderBy: [
        { position: 'asc' as const },
        { createdAt: 'asc' as const },
        { id: 'asc' as const },
      ],
      skip,
      take,
    };

    let data: TaskWithAssignees[];
    let total: number;

    if (db) {
      data = await prisma.task.findMany(findManyArgs);
      total = await prisma.task.count({ where });
    } else {
      [data, total] = await this.prisma.$transaction([
        this.prisma.task.findMany(findManyArgs),
        this.prisma.task.count({ where }),
      ]);
    }

    return buildPaginationResult(data, total, { page, limit });
  }

  async delete(taskId: string, db?: Db): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.task.delete({ where: { id: taskId } });
  }

  assignUser(taskId: string, userId: string, db?: Db): Promise<TaskAssignee> {
    const prisma = db ?? this.prisma;

    return prisma.taskAssignee.upsert({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
      update: {},
      create: {
        taskId,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async unassignUser(taskId: string, userId: string, db?: Db): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.taskAssignee.deleteMany({
      where: { taskId, userId },
    });
  }
}

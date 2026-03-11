import { Db, PRISMA } from '@api/prisma';
import { Prisma, PrismaClient } from '@repo/database';
import {
  CreateTaskInput,
  TaskWithAssignees,
  UpdateTaskInput,
  FindTasksInput,
  PaginatedTasksResult,
  TaskAssigneeWithUser,
  taskWithAssigneesInclude,
} from '../types/tasks.repository.types';
import { TasksRepository } from './tasks.repository';
import { Inject, Injectable } from '@nestjs/common';
import { buildPaginationResult, getPaginationParams } from '@api/common';
import { TaskAccessContext } from '../types/tasks.repository.types';

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  create(data: CreateTaskInput, db?: Db): Promise<TaskWithAssignees> {
    const prisma = db ?? this.prisma;

    return prisma.task.create({
      data,
      include: taskWithAssigneesInclude,
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
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
        ...(data.position !== undefined ? { position: data.position } : {}),
      },
      include: taskWithAssigneesInclude,
    });
  }

  findByIdOrThrow(taskId: string, db?: Db): Promise<TaskWithAssignees> {
    const prisma = db ?? this.prisma;

    return prisma.task.findUniqueOrThrow({
      where: { id: taskId },
      include: taskWithAssigneesInclude,
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

    const taskOrderBy = [
      { position: 'asc' as const },
      { createdAt: 'asc' as const },
      { id: 'asc' as const },
    ];

    let data;
    let total;

    if (db) {
      data = await prisma.task.findMany({
        where,
        include: taskWithAssigneesInclude,
        orderBy: taskOrderBy,
        skip,
        take,
      });
      total = await prisma.task.count({ where });
    } else {
      [data, total] = await this.prisma.$transaction([
        this.prisma.task.findMany({
          where,
          include: taskWithAssigneesInclude,
          orderBy: taskOrderBy,
          skip,
          take,
        }),
        this.prisma.task.count({ where }),
      ]);
    }

    return buildPaginationResult(data, total, { page, limit });
  }

  async findByIdWithAccessContext(
    taskId: string,
    userId: string,
    db?: Db,
  ): Promise<TaskAccessContext | null> {
    const prisma = db ?? this.prisma;

    return prisma.task
      .findUnique({
        where: { id: taskId },
        select: {
          id: true,
          createdById: true,
          projectId: true,
          assignees: {
            select: {
              userId: true,
            },
          },
          project: {
            select: {
              ownerId: true,
              members: {
                where: { userId },
                select: { role: true },
                take: 1,
              },
            },
          },
        },
      })
      .then((task) => {
        if (!task) return null;

        return {
          id: task.id,
          createdById: task.createdById,
          projectId: task.projectId,
          assignees: task.assignees,
          project: {
            ownerId: task.project.ownerId,
            currentUserRole: task.project.members[0]?.role ?? null,
          },
        };
      });
  }

  async delete(taskId: string, db?: Db): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.task.delete({ where: { id: taskId } });
  }

  assignUser(
    taskId: string,
    userId: string,
    db?: Db,
  ): Promise<TaskAssigneeWithUser> {
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

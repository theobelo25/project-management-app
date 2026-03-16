import { Db, PRISMA } from '@api/prisma';
import { Prisma, PrismaClient, TaskStatus } from '@repo/database';
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

type FindByIdWithAccessContextPayload = Prisma.TaskGetPayload<{
  select: {
    id: true;
    createdById: true;
    projectId: true;
    assignees: { select: { userId: true } };
    project: {
      select: {
        ownerId: true;
        members: { select: { role: true }; take: 1 };
      };
    };
  };
}>;

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
        assignees: { some: { userId: input.assigneeId } },
      }),
      ...(input.search && {
        OR: [
          { title: { contains: input.search, mode: 'insensitive' } },
          {
            description: { contains: input.search, mode: 'insensitive' },
          },
        ],
      }),
    };
    const orderBy: Prisma.TaskOrderByWithRelationInput[] =
      input.sort === 'created-desc'
        ? [{ createdAt: 'desc' }, { id: 'asc' }]
        : input.sort === 'title-asc'
          ? [{ title: 'asc' }, { id: 'asc' }]
          : input.sort === 'status-asc'
            ? [{ status: 'asc' }, { position: 'asc' }, { id: 'asc' }]
            : [{ updatedAt: 'desc' }, { id: 'asc' }]; // default "updated-desc"

    let data;
    let total;

    if (db) {
      data = await prisma.task.findMany({
        where,
        include: taskWithAssigneesInclude,
        orderBy: orderBy,
        skip,
        take,
      });
      total = await prisma.task.count({ where });
    } else {
      [data, total] = await this.prisma.$transaction([
        this.prisma.task.findMany({
          where,
          include: taskWithAssigneesInclude,
          orderBy: orderBy,
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
      .then((task: FindByIdWithAccessContextPayload | null) => {
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

  async getTaskCountsByProjectIds(
    projectIds: string[],
    db: Db,
  ): Promise<Map<string, { total: number; completed: number }>> {
    const prisma = db ?? this.prisma;
    if (projectIds.length === 0) return new Map();

    const rows = await prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      select: { projectId: true, status: true },
    });

    const map = new Map<string, { total: number; completed: number }>();
    for (const id of projectIds) {
      map.set(id, { total: 0, completed: 0 });
    }
    for (const row of rows) {
      const cur = map.get(row.projectId)!;
      cur.total += 1;
      if (row.status === TaskStatus.DONE) cur.completed += 1;
    }
    return map;
  }

  async findRecentByProjectId(
    projectId: string,
    limit: number,
    db?: Db,
  ): Promise<TaskWithAssignees[]> {
    const prisma = db ?? this.prisma;
    return prisma.task.findMany({
      where: { projectId },
      include: taskWithAssigneesInclude,
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }
}

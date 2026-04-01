import { Db, PRISMA } from '@api/prisma';
import { Prisma, PrismaClient, TaskStatus } from '@repo/database';
import {
  CreateTaskInput,
  TaskWithAssignees,
  UpdateTaskRepositoryInput,
  FindTasksInput,
  PaginatedTasksResult,
  TaskAssignmentPersistenceResult,
  taskWithAssigneesInclude,
  TaskAccessContext,
} from '../types/tasks.repository.types';
import { TasksRepository, TasksRepositoryTx } from './tasks.repository';
import { Inject, Injectable } from '@nestjs/common';
import { buildPaginationResult, getPaginationParams } from '@api/common';
import {
  mapTaskAssignmentPersistenceToEntity,
  mapTaskListToEntities,
  mapTaskWithAssigneesToEntity,
} from '../mappers/persistence-to-domain.mapper';

const taskAssigneeForAssignmentInclude = {
  user: true,
  task: {
    select: {
      title: true,
      projectId: true,
    },
  },
} satisfies Prisma.TaskAssigneeInclude;

type PrismaLike = PrismaClient | Prisma.TransactionClient;

function buildTaskAccessContextSelect(userId: string) {
  return {
    id: true,
    createdById: true,
    projectId: true,
    assignees: { select: { userId: true } },
    project: {
      select: {
        organizationId: true,
        ownerId: true,
        members: {
          where: { userId },
          select: { role: true },
          take: 1,
        },
      },
    },
  } satisfies Prisma.TaskSelect;
}

type FindByIdWithAccessContextPayload = Prisma.TaskGetPayload<{
  select: ReturnType<typeof buildTaskAccessContextSelect>;
}>;

function buildTaskWhere(input: FindTasksInput): Prisma.TaskWhereInput {
  return {
    projectId: input.projectId,
    project: { organizationId: input.orgId },
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.labelColor !== undefined ? { labelColor: input.labelColor } : {}),
    ...(input.assigneeId !== undefined
      ? { assignees: { some: { userId: input.assigneeId } } }
      : {}),
    ...(input.search !== undefined
      ? {
          OR: [
            {
              title: { contains: input.search, mode: 'insensitive' },
            },
            {
              description: { contains: input.search, mode: 'insensitive' },
            },
          ],
        }
      : {}),
  };
}

function buildTaskOrderBy(
  sort: FindTasksInput['sort'],
): Prisma.TaskOrderByWithRelationInput[] {
  if (sort === 'created-desc') return [{ createdAt: 'desc' }, { id: 'asc' }];
  if (sort === 'title-asc') return [{ title: 'asc' }, { id: 'asc' }];
  if (sort === 'status-asc')
    return [{ status: 'asc' }, { position: 'asc' }, { id: 'asc' }];

  return [{ updatedAt: 'desc' }, { id: 'asc' }];
}

function buildUpdateTaskPatch(
  data: UpdateTaskRepositoryInput,
): Prisma.TaskUpdateInput {
  return {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined
      ? { description: data.description }
      : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.priority !== undefined ? { priority: data.priority } : {}),
    ...(data.labelColor !== undefined ? { labelColor: data.labelColor } : {}),
    ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
    ...(data.position !== undefined ? { position: data.position } : {}),
  };
}

function mapAccessPayloadToContext(
  task: FindByIdWithAccessContextPayload,
): TaskAccessContext {
  return {
    id: task.id,
    createdById: task.createdById,
    projectId: task.projectId,
    assignees: task.assignees,
    project: {
      orgId: task.project.organizationId,
      ownerId: task.project.ownerId,
      currentUserRole: task.project.members[0]?.role ?? null,
    },
  };
}

function buildTaskUncheckedCreateInput(
  data: CreateTaskInput,
): Prisma.TaskUncheckedCreateInput {
  const { assigneeIds, ...rest } = data;
  const uniqueAssigneeIds =
    assigneeIds && assigneeIds.length > 0 ? [...new Set(assigneeIds)] : [];

  return {
    ...rest,
    ...(uniqueAssigneeIds.length > 0
      ? {
          assignees: {
            create: uniqueAssigneeIds.map((userId) => ({ userId })),
          },
        }
      : {}),
  };
}

function createTask(
  prisma: PrismaLike,
  data: CreateTaskInput,
): Promise<TaskWithAssignees> {
  return prisma.task.create({
    data: buildTaskUncheckedCreateInput(data),
    include: taskWithAssigneesInclude,
  });
}

function updateTask(
  prisma: PrismaLike,
  taskId: string,
  data: UpdateTaskRepositoryInput,
): Promise<TaskWithAssignees> {
  return prisma.task.update({
    where: { id: taskId },
    data: buildUpdateTaskPatch(data),
    include: taskWithAssigneesInclude,
  });
}

function findTaskByIdOrThrow(
  prisma: PrismaLike,
  taskId: string,
): Promise<TaskWithAssignees> {
  return prisma.task.findUniqueOrThrow({
    where: { id: taskId },
    include: taskWithAssigneesInclude,
  });
}

async function findTaskByIdWithAccessContext(
  prisma: PrismaLike,
  taskId: string,
  userId: string,
): Promise<TaskAccessContext | null> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: buildTaskAccessContextSelect(userId),
  });

  if (!task) return null;
  return mapAccessPayloadToContext(task);
}

async function deleteTask(prisma: PrismaLike, taskId: string): Promise<void> {
  await prisma.task.delete({ where: { id: taskId } });
}

async function assignUserImpl(
  prisma: PrismaLike,
  taskId: string,
  userId: string,
): Promise<TaskAssignmentPersistenceResult> {
  try {
    const created = await prisma.taskAssignee.create({
      data: { taskId, userId },
      include: taskAssigneeForAssignmentInclude,
    });

    return {
      assignment: created,
      created: true,
    };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      const existing = await prisma.taskAssignee.findUnique({
        where: { taskId_userId: { taskId, userId } },
        include: taskAssigneeForAssignmentInclude,
      });

      if (!existing) throw err;

      return {
        assignment: existing,
        created: false,
      };
    }

    throw err;
  }
}

async function unassignUserImpl(
  prisma: PrismaLike,
  taskId: string,
  userId: string,
): Promise<number> {
  const { count } = await prisma.taskAssignee.deleteMany({
    where: { taskId, userId },
  });

  return count;
}

async function getTaskCountsByProjectIdsImpl(
  prisma: PrismaLike,
  projectIds: string[],
  orgId: string,
): Promise<Map<string, { total: number; completed: number }>> {
  if (projectIds.length === 0) return new Map();

  const rows = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      project: { organizationId: orgId },
    },
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

function findRecentByProjectIdImpl(
  prisma: PrismaLike,
  projectId: string,
  limit: number,
  orgId: string,
): Promise<TaskWithAssignees[]> {
  return prisma.task.findMany({
    where: {
      projectId,
      project: { organizationId: orgId },
    },
    include: taskWithAssigneesInclude,
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
}

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
  /** Root client only — has `$transaction`. */
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  create(data: CreateTaskInput) {
    return createTask(this.prisma, data).then(mapTaskWithAssigneesToEntity);
  }

  update(taskId: string, data: UpdateTaskRepositoryInput) {
    return updateTask(this.prisma, taskId, data).then(
      mapTaskWithAssigneesToEntity,
    );
  }

  findByIdOrThrow(taskId: string) {
    return findTaskByIdOrThrow(this.prisma, taskId).then(
      mapTaskWithAssigneesToEntity,
    );
  }

  async findMany(input: FindTasksInput): Promise<PaginatedTasksResult> {
    const { skip, take, page, limit } = getPaginationParams(input);

    const where = buildTaskWhere(input);
    const orderBy = buildTaskOrderBy(input.sort);

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        include: taskWithAssigneesInclude,
        orderBy,
        skip,
        take,
      }),
      this.prisma.task.count({ where }),
    ]);

    return buildPaginationResult(mapTaskListToEntities(rows), total, {
      page,
      limit,
    });
  }

  findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null> {
    return findTaskByIdWithAccessContext(this.prisma, taskId, userId);
  }

  async delete(taskId: string): Promise<void> {
    await deleteTask(this.prisma, taskId);
  }

  assignUser(taskId: string, userId: string) {
    return this.prisma
      .$transaction((tx) => assignUserImpl(tx, taskId, userId), {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5_000,
        timeout: 10_000,
      })
      .then(mapTaskAssignmentPersistenceToEntity);
  }

  unassignUser(taskId: string, userId: string): Promise<number> {
    return this.prisma.$transaction(
      (tx) => unassignUserImpl(tx, taskId, userId),
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5_000,
        timeout: 10_000,
      },
    );
  }

  getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>> {
    return getTaskCountsByProjectIdsImpl(this.prisma, projectIds, orgId);
  }

  findRecentByProjectId(projectId: string, limit: number, orgId: string) {
    return findRecentByProjectIdImpl(this.prisma, projectId, limit, orgId).then(
      mapTaskListToEntities,
    );
  }
}

export class PrismaTasksRepositoryTx extends TasksRepositoryTx {
  /** Already inside an outer `$transaction` — do not nest `$transaction` here. */
  constructor(private readonly prisma: Prisma.TransactionClient) {
    super();
  }

  create(data: CreateTaskInput) {
    return createTask(this.prisma, data).then(mapTaskWithAssigneesToEntity);
  }

  update(taskId: string, data: UpdateTaskRepositoryInput) {
    return updateTask(this.prisma, taskId, data).then(
      mapTaskWithAssigneesToEntity,
    );
  }

  findByIdOrThrow(taskId: string) {
    return findTaskByIdOrThrow(this.prisma, taskId).then(
      mapTaskWithAssigneesToEntity,
    );
  }

  async findMany(input: FindTasksInput): Promise<PaginatedTasksResult> {
    const { skip, take, page, limit } = getPaginationParams(input);

    const where = buildTaskWhere(input);
    const orderBy = buildTaskOrderBy(input.sort);

    const rows = await this.prisma.task.findMany({
      where,
      include: taskWithAssigneesInclude,
      orderBy,
      skip,
      take,
    });

    const total = await this.prisma.task.count({ where });

    return buildPaginationResult(mapTaskListToEntities(rows), total, {
      page,
      limit,
    });
  }

  findByIdWithAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null> {
    return findTaskByIdWithAccessContext(this.prisma, taskId, userId);
  }

  async delete(taskId: string): Promise<void> {
    await deleteTask(this.prisma, taskId);
  }

  assignUser(taskId: string, userId: string) {
    return assignUserImpl(this.prisma, taskId, userId).then(
      mapTaskAssignmentPersistenceToEntity,
    );
  }

  unassignUser(taskId: string, userId: string): Promise<number> {
    return unassignUserImpl(this.prisma, taskId, userId);
  }

  getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>> {
    return getTaskCountsByProjectIdsImpl(this.prisma, projectIds, orgId);
  }

  findRecentByProjectId(projectId: string, limit: number, orgId: string) {
    return findRecentByProjectIdImpl(this.prisma, projectId, limit, orgId).then(
      mapTaskListToEntities,
    );
  }
}

export type { Db };

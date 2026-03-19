import { Inject, Injectable } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PinoLogger } from 'nestjs-pino';
import {
  AuthUser,
  TaskView,
  PaginationResult,
  TaskAssignmentView,
} from '@repo/types';
import {
  toCreateTaskInput,
  toTaskView,
  toTaskViews,
  toUpdateTaskInput,
} from './mappers/tasks.mapper';
import { toTaskAssignmentView } from './mappers/task-assignment.mapper';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { TASKS_REPOSITORY } from './tasks.tokens';
import { TaskAssignmentNotifier } from './notifiers/task-assignment-notifier';
import { TaskAssigneePolicy } from './policies/task-assignee-policy';
import {
  throwTaskNotFoundOnPrismaP2025,
  throwTaskNotFoundOnPrismaAssignOrUnassignErrors,
} from './utils/task-prisma-error-mapper';

/** Base fields so logs are filterable in Loki/Datadog/etc. */
const TASKS_LOG_CTX = {
  domain: 'tasks',
  component: 'TasksService',
} as const;

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY)
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssigneePolicy: TaskAssigneePolicy,
    private readonly taskAssignmentNotifier: TaskAssignmentNotifier,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * SECURITY INVARIANT
   * ------------------
   * This service intentionally does NOT re-check authorization on every method call.
   * Authorization is enforced at the HTTP boundary by `TasksController` + `TaskAccessGuard`
   * via `@RequireTaskAccess(...)` metadata.
   *
   * MUST NOT call these methods from non-HTTP code paths (or from other modules)
   * without an explicit authorization check.
   */

  async create(user: AuthUser, dto: CreateTaskDto): Promise<TaskView> {
    const input = toCreateTaskInput(dto, user.id);
    const task = await this.tasksRepository.create(input);

    this.logger.info(
      {
        ...TASKS_LOG_CTX,
        event: 'task.created',
        taskId: task.id,
        createdById: task.createdById,
        projectId: task.projectId,
      },
      'Task created successfully',
    );

    return toTaskView(task);
  }

  async update(
    taskId: string,
    user: AuthUser,
    dto: UpdateTaskDto,
  ): Promise<TaskView> {
    const input = toUpdateTaskInput(dto);

    let task;
    try {
      task = await this.tasksRepository.update(taskId, input);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: user.id });
    }

    this.logger.info(
      {
        ...TASKS_LOG_CTX,
        event: 'task.updated',
        taskId: task.id,
        updatedById: user.id,
        projectId: task.projectId,
      },
      'Task updated successfully',
    );

    return toTaskView(task);
  }

  async findById(taskId: string, user: AuthUser): Promise<TaskView> {
    let task;
    try {
      task = await this.tasksRepository.findByIdOrThrow(taskId);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: user.id });
    }

    return toTaskView(task);
  }

  async findMany(
    user: AuthUser,
    query: FindTasksQueryDto,
  ): Promise<PaginationResult<TaskView>> {
    const result = await this.tasksRepository.findMany({
      orgId: user.orgId,
      ...query,
    });

    return {
      ...result,
      data: toTaskViews(result.data),
    };
  }

  async delete(taskId: string, user: AuthUser): Promise<void> {
    try {
      await this.tasksRepository.delete(taskId);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: user.id });
    }

    this.logger.info(
      {
        ...TASKS_LOG_CTX,
        event: 'task.deleted',
        taskId,
        deletedById: user.id,
      },
      'Task deleted successfully',
    );
  }

  async assignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<TaskAssignmentView> {
    await this.taskAssigneePolicy.assertAssigneeInSameOrgOrThrow(
      assigneeUserId,
      currentUser,
    );

    let assignmentResult: Awaited<ReturnType<TasksRepository['assignUser']>>;

    try {
      assignmentResult = await this.tasksRepository.assignUser(
        taskId,
        assigneeUserId,
      );
    } catch (err) {
      throwTaskNotFoundOnPrismaAssignOrUnassignErrors(err, {
        taskId,
        assigneeUserId,
        requesterUserId: currentUser.id,
      });
    }

    const { assignment, created } = assignmentResult;

    if (created && assigneeUserId !== currentUser.id) {
      try {
        await this.taskAssignmentNotifier.notifyTaskAssigned(assigneeUserId, {
          taskId,
          taskTitle: assignment.task.title,
          projectId: assignment.task.projectId,
          assignedById: currentUser.id,
        });
      } catch (err) {
        this.logger.warn(
          {
            ...TASKS_LOG_CTX,
            event: 'task.assignee.notification_failed',
            taskId,
            userId: assigneeUserId,
            updatedById: currentUser.id,
            err,
          },
          'Failed to notify task assignee',
        );
      }
    }

    if (created) {
      this.logger.info(
        {
          ...TASKS_LOG_CTX,
          event: 'task.assignee.added',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUser.id,
        },
        'Task assignee added successfully',
      );
    }

    return toTaskAssignmentView(assignment);
  }

  async unassignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<void> {
    let deletedCount: number;
    try {
      deletedCount = await this.tasksRepository.unassignUser(
        taskId,
        assigneeUserId,
      );
    } catch (err) {
      throwTaskNotFoundOnPrismaAssignOrUnassignErrors(err, {
        taskId,
        assigneeUserId,
        requesterUserId: currentUser.id,
      });
    }

    if (deletedCount > 0) {
      this.logger.info(
        {
          ...TASKS_LOG_CTX,
          event: 'task.assignee.removed',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUser.id,
        },
        'Task assignee removed successfully',
      );
    }
  }
}

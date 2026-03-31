import { Injectable } from '@nestjs/common';
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
import { TaskAssignmentNotifier } from './notifiers/task-assignment-notifier';
import { TaskAssigneePolicy } from './policies/task-assignee-policy';
import {
  throwTaskNotFoundOnPrismaP2025,
  throwTaskNotFoundOnPrismaAssignOrUnassignErrors,
} from './utils/task-prisma-error-mapper';
import { RealtimePublisher } from '../realtime/realtime.publisher';
import { REALTIME_EVENT } from '../realtime/realtime.events';
import {
  PROJECT_MEMBER_REPOSITORY,
  type ProjectMemberRepository,
} from '../projects/repositories/projects.repository';
import { Inject } from '@nestjs/common';

/** Base fields so logs are filterable in Loki/Datadog/etc. */
const TASKS_LOG_CTX = {
  domain: 'tasks',
  component: 'TasksService',
} as const;

const TASK_UPDATE_LABELS: Record<string, string> = {
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  dueDate: 'due date',
  labelColor: 'label',
  assigneeIds: 'assignees',
  position: 'position',
};

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssigneePolicy: TaskAssigneePolicy,
    private readonly taskAssignmentNotifier: TaskAssignmentNotifier,
    private readonly realtimePublisher: RealtimePublisher,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMembersRepository: ProjectMemberRepository,
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
    const assigneeIds =
      dto.assigneeIds && dto.assigneeIds.length > 0
        ? [...new Set(dto.assigneeIds)]
        : [];

    for (const assigneeUserId of assigneeIds) {
      await this.taskAssigneePolicy.assertAssigneeCanBeAssignedToProjectOrThrow(
        assigneeUserId,
        dto.projectId,
        user,
      );
    }

    const input = toCreateTaskInput(dto, user.id);
    const task = await this.tasksRepository.create(input);

    for (const assigneeUserId of assigneeIds) {
      if (assigneeUserId === user.id) continue;
      try {
        await this.taskAssignmentNotifier.notifyTaskAssigned(assigneeUserId, {
          taskId: task.id,
          taskTitle: task.title,
          projectId: task.projectId,
          assignedById: user.id,
        });
      } catch (err) {
        this.logger.warn(
          {
            ...TASKS_LOG_CTX,
            event: 'task.created.assignee_notification_failed',
            taskId: task.id,
            userId: assigneeUserId,
            createdById: user.id,
            err,
          },
          'Failed to notify task assignee on create',
        );
      }
    }

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

    this.realtimePublisher.toProject(task.projectId, REALTIME_EVENT.taskCreated, {
      taskId: task.id,
      projectId: task.projectId,
      updatedById: user.id,
      changedFields: ['created'],
    });

    return toTaskView(task);
  }

  async update(
    taskId: string,
    user: AuthUser,
    dto: UpdateTaskDto,
  ): Promise<TaskView> {
    const input = toUpdateTaskInput(dto);
    const changedFields = Object.keys(input).filter(
      (field) =>
        (input as unknown as Record<string, unknown>)[field] !== undefined,
    );

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

    const projectMembers = await this.projectMembersRepository.findMembersByProjectId(
      task.projectId,
    );

    for (const member of projectMembers) {
      if (member.userId === user.id) continue;
      try {
        await this.taskAssignmentNotifier.notifyTaskUpdated(member.userId, {
          taskId: task.id,
          taskTitle: task.title,
          projectId: task.projectId,
          updatedById: user.id,
          changedFields: changedFields.map(
            (field) => TASK_UPDATE_LABELS[field] ?? field,
          ),
        });
      } catch (err) {
        this.logger.warn(
          {
            ...TASKS_LOG_CTX,
            event: 'task.updated.assignee_notification_failed',
            taskId: task.id,
            userId: member.userId,
            updatedById: user.id,
            err,
          },
          'Failed to notify task assignee on update',
        );
      }
    }

    this.realtimePublisher.toProject(task.projectId, REALTIME_EVENT.taskUpdated, {
      taskId: task.id,
      projectId: task.projectId,
      updatedById: user.id,
      changedFields,
    });
    this.realtimePublisher.toTask(task.id, REALTIME_EVENT.taskUpdated, {
      taskId: task.id,
      projectId: task.projectId,
      updatedById: user.id,
      changedFields,
    });

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
    const task = await this.findById(taskId, user);

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

    this.realtimePublisher.toProject(task.projectId, REALTIME_EVENT.taskDeleted, {
      taskId,
      projectId: task.projectId,
      updatedById: user.id,
      changedFields: ['deleted'],
    });
    this.realtimePublisher.toTask(taskId, REALTIME_EVENT.taskDeleted, {
      taskId,
      projectId: task.projectId,
      updatedById: user.id,
      changedFields: ['deleted'],
    });
  }

  async assignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<TaskAssignmentView> {
    let task;
    try {
      task = await this.tasksRepository.findByIdOrThrow(taskId);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: currentUser.id });
    }

    await this.taskAssigneePolicy.assertAssigneeCanBeAssignedToProjectOrThrow(
      assigneeUserId,
      task.projectId,
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

      this.realtimePublisher.toProject(
        assignment.task.projectId,
        REALTIME_EVENT.taskAssigneeAdded,
        {
          taskId,
          projectId: assignment.task.projectId,
          assigneeUserId,
          updatedById: currentUser.id,
          changedFields: ['assignees'],
        },
      );
      this.realtimePublisher.toTask(taskId, REALTIME_EVENT.taskAssigneeAdded, {
        taskId,
        projectId: assignment.task.projectId,
        assigneeUserId,
        updatedById: currentUser.id,
        changedFields: ['assignees'],
      });
    }

    return toTaskAssignmentView(assignment);
  }

  async unassignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<void> {
    const task = await this.findById(taskId, currentUser);

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

      this.realtimePublisher.toProject(
        task.projectId,
        REALTIME_EVENT.taskAssigneeRemoved,
        {
          taskId,
          projectId: task.projectId,
          assigneeUserId,
          updatedById: currentUser.id,
          changedFields: ['assignees'],
        },
      );
      this.realtimePublisher.toTask(taskId, REALTIME_EVENT.taskAssigneeRemoved, {
        taskId,
        projectId: task.projectId,
        assigneeUserId,
        updatedById: currentUser.id,
        changedFields: ['assignees'],
      });
    }
  }
}

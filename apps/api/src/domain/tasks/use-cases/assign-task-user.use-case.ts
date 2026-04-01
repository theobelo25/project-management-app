import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthUser, TaskAssignmentView } from '@repo/types';
import { TasksRepository } from '../repositories/tasks.repository';
import { toTaskAssignmentView } from '../mappers/task-assignment.mapper';
import { TaskAssigneePolicy } from '../policies/task-assignee-policy';
import {
  throwTaskNotFoundOnPrismaP2025,
  throwTaskNotFoundOnPrismaAssignOrUnassignErrors,
} from '../utils/task-prisma-error-mapper';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import { buildTaskAssigneeAddedEvent } from '../events/task-events.mapper';

const LOG_CTX = {
  domain: 'tasks',
  component: 'AssignTaskUserUseCase',
} as const;

@Injectable()
export class AssignTaskUserUseCase {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssigneePolicy: TaskAssigneePolicy,
    private readonly taskDomainEventPublisher: TaskDomainEventPublisher,
    private readonly logger: PinoLogger,
  ) {}

  async execute(
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

    if (created) {
      this.logger.info(
        {
          ...LOG_CTX,
          event: 'task.assignee.added',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUser.id,
        },
        'Task assignee added successfully',
      );

      this.taskDomainEventPublisher.publish(
        buildTaskAssigneeAddedEvent({
          taskId,
          projectId: assignment.task.projectId,
          taskTitle: assignment.task.title,
          assigneeUserId,
          updatedById: currentUser.id,
          notifyAssignee: assigneeUserId !== currentUser.id,
        }),
      );
    }

    return toTaskAssignmentView(assignment);
  }
}

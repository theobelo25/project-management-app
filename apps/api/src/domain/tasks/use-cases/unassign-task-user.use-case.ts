import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthUser } from '@repo/types';
import { TasksRepository } from '../repositories/tasks.repository';
import {
  throwTaskNotFoundOnPrismaP2025,
  throwTaskNotFoundOnPrismaAssignOrUnassignErrors,
} from '../utils/task-prisma-error-mapper';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import { buildTaskAssigneeRemovedEvent } from '../events/task-events.mapper';

const LOG_CTX = {
  domain: 'tasks',
  component: 'UnassignTaskUserUseCase',
} as const;

@Injectable()
export class UnassignTaskUserUseCase {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskDomainEventPublisher: TaskDomainEventPublisher,
    private readonly logger: PinoLogger,
  ) {}

  async execute(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<void> {
    let task;
    try {
      task = await this.tasksRepository.findByIdOrThrow(taskId);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: currentUser.id });
    }

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
          ...LOG_CTX,
          event: 'task.assignee.removed',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUser.id,
        },
        'Task assignee removed successfully',
      );

      this.taskDomainEventPublisher.publish(
        buildTaskAssigneeRemovedEvent({
          taskId,
          projectId: task.projectId,
          assigneeUserId,
          updatedById: currentUser.id,
        }),
      );
    }
  }
}

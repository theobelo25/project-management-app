import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthUser } from '@repo/types';
import { TasksRepository } from '../repositories/tasks.repository';
import { throwTaskNotFoundOnPrismaP2025 } from '../utils/task-prisma-error-mapper';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import { buildTaskDeletedEvent } from '../events/task-events.mapper';

const LOG_CTX = {
  domain: 'tasks',
  component: 'DeleteTaskUseCase',
} as const;

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskDomainEventPublisher: TaskDomainEventPublisher,
    private readonly logger: PinoLogger,
  ) {}

  async execute(taskId: string, user: AuthUser): Promise<void> {
    let task;
    try {
      task = await this.tasksRepository.findByIdOrThrow(taskId);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: user.id });
    }

    try {
      await this.tasksRepository.delete(taskId);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: user.id });
    }

    this.logger.info(
      {
        ...LOG_CTX,
        event: 'task.deleted',
        taskId,
        deletedById: user.id,
      },
      'Task deleted successfully',
    );

    this.taskDomainEventPublisher.publish(
      buildTaskDeletedEvent({
        taskId,
        projectId: task.projectId,
        updatedById: user.id,
      }),
    );
  }
}

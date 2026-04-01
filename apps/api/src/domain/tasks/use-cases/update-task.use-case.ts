import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthUser, TaskView } from '@repo/types';
import { TasksRepository } from '../repositories/tasks.repository';
import type { UpdateTaskCommand } from '../application/task-application.types';
import {
  commandToUpdateTaskRepositoryInput,
  toTaskView,
} from '../mappers/tasks.mapper';
import { throwTaskNotFoundOnPrismaP2025 } from '../utils/task-prisma-error-mapper';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import { buildTaskUpdatedEvent } from '../events/task-events.mapper';

const LOG_CTX = {
  domain: 'tasks',
  component: 'UpdateTaskUseCase',
} as const;

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskDomainEventPublisher: TaskDomainEventPublisher,
    private readonly logger: PinoLogger,
  ) {}

  async execute(
    taskId: string,
    user: AuthUser,
    command: UpdateTaskCommand,
  ): Promise<TaskView> {
    const input = commandToUpdateTaskRepositoryInput(command);
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
        ...LOG_CTX,
        event: 'task.updated',
        taskId: task.id,
        updatedById: user.id,
        projectId: task.projectId,
      },
      'Task updated successfully',
    );

    this.taskDomainEventPublisher.publish(
      buildTaskUpdatedEvent({
        taskId: task.id,
        projectId: task.projectId,
        taskTitle: task.title,
        updatedById: user.id,
        changedFieldKeys: changedFields,
      }),
    );

    return toTaskView(task);
  }
}

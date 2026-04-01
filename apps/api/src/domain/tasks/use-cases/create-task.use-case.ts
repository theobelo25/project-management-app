import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthUser, TaskView } from '@repo/types';
import { TasksRepository } from '../repositories/tasks.repository';
import type { CreateTaskCommand } from '../application/task-application.types';
import { commandToCreateTaskInput, toTaskView } from '../mappers/tasks.mapper';
import { TaskAssigneePolicy } from '../policies/task-assignee-policy';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import { buildTaskCreatedEvent } from '../events/task-events.mapper';

const LOG_CTX = {
  domain: 'tasks',
  component: 'CreateTaskUseCase',
} as const;

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssigneePolicy: TaskAssigneePolicy,
    private readonly taskDomainEventPublisher: TaskDomainEventPublisher,
    private readonly logger: PinoLogger,
  ) {}

  async execute(user: AuthUser, command: CreateTaskCommand): Promise<TaskView> {
    const assigneeIds =
      command.assigneeIds && command.assigneeIds.length > 0
        ? [...new Set(command.assigneeIds)]
        : [];

    for (const assigneeUserId of assigneeIds) {
      await this.taskAssigneePolicy.assertAssigneeCanBeAssignedToProjectOrThrow(
        assigneeUserId,
        command.projectId,
        user,
      );
    }

    const input = commandToCreateTaskInput(command, user.id);
    const task = await this.tasksRepository.create(input);

    const assigneeUserIdsToNotify = assigneeIds.filter((id) => id !== user.id);

    this.logger.info(
      {
        ...LOG_CTX,
        event: 'task.created',
        taskId: task.id,
        createdById: task.createdById,
        projectId: task.projectId,
      },
      'Task created successfully',
    );

    this.taskDomainEventPublisher.publish(
      buildTaskCreatedEvent({
        taskId: task.id,
        projectId: task.projectId,
        taskTitle: task.title,
        createdById: user.id,
        assigneeUserIdsToNotify,
      }),
    );

    return toTaskView(task);
  }
}

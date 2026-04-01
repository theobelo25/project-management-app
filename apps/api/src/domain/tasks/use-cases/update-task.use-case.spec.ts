import { PinoLogger } from 'nestjs-pino';
import { TaskPriority, TaskStatus } from '@repo/database';
import { AuthUser } from '@repo/types';

import { UpdateTaskUseCase } from './update-task.use-case';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import type { UpdateTaskCommand } from '../application/task-application.types';
import type { TaskEntity } from '../domain/task.entity';

function taskEntityFixture(): TaskEntity {
  const now = new Date('2026-03-01T12:00:00.000Z');
  return {
    id: 'task-1',
    projectId: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Updated title',
    description: 'New body',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    labelColor: null,
    dueDate: null,
    position: 0,
    createdAt: now,
    updatedAt: now,
    createdById: 'user-1',
    assignees: [],
  };
}

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;

  let tasksRepository: { update: jest.Mock };
  let taskDomainEventPublisher: { publish: jest.Mock };
  let logger: { info: jest.Mock };

  const user: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    tasksRepository = { update: jest.fn() };
    taskDomainEventPublisher = { publish: jest.fn() };
    logger = { info: jest.fn() };

    useCase = new UpdateTaskUseCase(
      tasksRepository as unknown as TasksRepository,
      taskDomainEventPublisher as unknown as TaskDomainEventPublisher,
      logger as unknown as PinoLogger,
    );
  });

  it('applies patch, publishes TaskUpdated with changed field keys, returns view', async () => {
    const command = {
      title: 'Updated title',
      description: 'New body',
    } as UpdateTaskCommand;

    tasksRepository.update.mockResolvedValue(taskEntityFixture());

    await useCase.execute('task-1', user, command);

    expect(tasksRepository.update).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({
        title: 'Updated title',
        description: 'New body',
      }),
    );

    expect(taskDomainEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _tag: 'TaskUpdated',
        taskId: 'task-1',
        changedFieldKeys: ['title', 'description'],
      }),
    );
  });
});

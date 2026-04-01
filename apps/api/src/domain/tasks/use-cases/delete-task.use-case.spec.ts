import { PinoLogger } from 'nestjs-pino';
import { TaskPriority, TaskStatus } from '@repo/database';
import { AuthUser } from '@repo/types';

import { DeleteTaskUseCase } from './delete-task.use-case';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import type { TaskEntity } from '../domain/task.entity';

function taskEntityFixture(): TaskEntity {
  const now = new Date('2026-03-01T12:00:00.000Z');
  return {
    id: 'task-1',
    projectId: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Gone',
    description: null,
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

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;

  let tasksRepository: {
    findByIdOrThrow: jest.Mock;
    delete: jest.Mock;
  };
  let taskDomainEventPublisher: { publish: jest.Mock };
  let logger: { info: jest.Mock };

  const user: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    tasksRepository = {
      findByIdOrThrow: jest.fn(),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    taskDomainEventPublisher = { publish: jest.fn() };
    logger = { info: jest.fn() };

    useCase = new DeleteTaskUseCase(
      tasksRepository as unknown as TasksRepository,
      taskDomainEventPublisher as unknown as TaskDomainEventPublisher,
      logger as unknown as PinoLogger,
    );
  });

  it('loads task for context, deletes, logs, publishes TaskDeleted', async () => {
    tasksRepository.findByIdOrThrow.mockResolvedValue(taskEntityFixture());

    await useCase.execute('task-1', user);

    expect(tasksRepository.delete).toHaveBeenCalledWith('task-1');
    expect(taskDomainEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _tag: 'TaskDeleted',
        taskId: 'task-1',
        projectId: '550e8400-e29b-41d4-a716-446655440001',
        updatedById: user.id,
      }),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'task.deleted', taskId: 'task-1' }),
      'Task deleted successfully',
    );
  });
});

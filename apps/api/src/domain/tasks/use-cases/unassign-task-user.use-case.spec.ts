import { PinoLogger } from 'nestjs-pino';
import { TaskPriority, TaskStatus } from '@repo/database';
import { AuthUser } from '@repo/types';

import { UnassignTaskUserUseCase } from './unassign-task-user.use-case';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import type { TaskEntity } from '../domain/task.entity';

function taskEntityFixture(): TaskEntity {
  const now = new Date('2026-03-01T12:00:00.000Z');
  return {
    id: 'task-1',
    projectId: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Task',
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

describe('UnassignTaskUserUseCase', () => {
  let useCase: UnassignTaskUserUseCase;

  let tasksRepository: {
    findByIdOrThrow: jest.Mock;
    unassignUser: jest.Mock;
  };
  let taskDomainEventPublisher: { publish: jest.Mock };
  let logger: { info: jest.Mock };

  const currentUser: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    tasksRepository = {
      findByIdOrThrow: jest.fn(),
      unassignUser: jest.fn(),
    };
    taskDomainEventPublisher = { publish: jest.fn() };
    logger = { info: jest.fn() };

    useCase = new UnassignTaskUserUseCase(
      tasksRepository as unknown as TasksRepository,
      taskDomainEventPublisher as unknown as TaskDomainEventPublisher,
      logger as unknown as PinoLogger,
    );
  });

  it('when a row was removed: logs and publishes TaskAssigneeRemoved', async () => {
    tasksRepository.findByIdOrThrow.mockResolvedValue(taskEntityFixture());
    tasksRepository.unassignUser.mockResolvedValue(1);

    await useCase.execute('task-1', 'user-2', currentUser);

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'task.assignee.removed',
        taskId: 'task-1',
        userId: 'user-2',
      }),
      'Task assignee removed successfully',
    );
    expect(taskDomainEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _tag: 'TaskAssigneeRemoved',
        taskId: 'task-1',
        assigneeUserId: 'user-2',
        projectId: '550e8400-e29b-41d4-a716-446655440001',
      }),
    );
  });

  it('when unassign is idempotent (no row deleted): no log and no domain event', async () => {
    tasksRepository.findByIdOrThrow.mockResolvedValue(taskEntityFixture());
    tasksRepository.unassignUser.mockResolvedValue(0);

    await useCase.execute('task-1', 'user-2', currentUser);

    expect(logger.info).not.toHaveBeenCalled();
    expect(taskDomainEventPublisher.publish).not.toHaveBeenCalled();
  });
});

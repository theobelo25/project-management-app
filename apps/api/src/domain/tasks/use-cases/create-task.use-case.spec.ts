import { PinoLogger } from 'nestjs-pino';
import { TaskPriority, TaskStatus } from '@repo/database';
import { AuthUser, TaskView } from '@repo/types';

import { CreateTaskUseCase } from './create-task.use-case';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskAssigneePolicy } from '../policies/task-assignee-policy';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import type { CreateTaskCommand } from '../application/task-application.types';
import type { TaskEntity } from '../domain/task.entity';

function taskEntityFixture(over: Partial<TaskEntity> = {}): TaskEntity {
  const now = new Date('2026-03-01T12:00:00.000Z');
  return {
    id: 'task-1',
    projectId: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Example',
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
    ...over,
  };
}

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;

  let tasksRepository: { create: jest.Mock };
  let taskAssigneePolicy: {
    assertAssigneeCanBeAssignedToProjectOrThrow: jest.Mock;
  };
  let taskDomainEventPublisher: { publish: jest.Mock };
  let logger: { info: jest.Mock };

  const user: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    tasksRepository = { create: jest.fn() };
    taskAssigneePolicy = {
      assertAssigneeCanBeAssignedToProjectOrThrow: jest
        .fn()
        .mockResolvedValue(undefined),
    };
    taskDomainEventPublisher = { publish: jest.fn() };
    logger = { info: jest.fn() };

    useCase = new CreateTaskUseCase(
      tasksRepository as unknown as TasksRepository,
      taskAssigneePolicy as unknown as TaskAssigneePolicy,
      taskDomainEventPublisher as unknown as TaskDomainEventPublisher,
      logger as unknown as PinoLogger,
    );
  });

  it('persists task, logs, publishes TaskCreated, returns API view', async () => {
    const command = {
      title: 'Ship feature',
      projectId: '550e8400-e29b-41d4-a716-446655440001',
    } as CreateTaskCommand;

    const entity = taskEntityFixture({
      title: 'Ship feature',
      id: 'task-new',
    });
    tasksRepository.create.mockResolvedValue(entity);

    const result = await useCase.execute(user, command);

    expect(tasksRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Ship feature',
        projectId: command.projectId,
        createdById: user.id,
      }),
    );

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'task.created',
        taskId: 'task-new',
        projectId: command.projectId,
      }),
      'Task created successfully',
    );

    expect(taskDomainEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _tag: 'TaskCreated',
        taskId: 'task-new',
        projectId: command.projectId,
        assigneeUserIdsToNotify: [],
      }),
    );

    expect(result).toMatchObject({
      id: 'task-new',
      title: 'Ship feature',
      projectId: command.projectId,
    } satisfies Partial<TaskView>);
  });

  it('validates each unique assignee and notifies others (not the creator)', async () => {
    const projectId = '550e8400-e29b-41d4-a716-446655440001';
    const command = {
      title: 'T',
      projectId,
      assigneeIds: ['user-2', 'user-1', 'user-2'],
    } as CreateTaskCommand;

    const entity = taskEntityFixture({ title: 'T' });
    tasksRepository.create.mockResolvedValue(entity);

    await useCase.execute(user, command);

    expect(
      taskAssigneePolicy.assertAssigneeCanBeAssignedToProjectOrThrow,
    ).toHaveBeenCalledTimes(2);
    expect(
      taskAssigneePolicy.assertAssigneeCanBeAssignedToProjectOrThrow,
    ).toHaveBeenCalledWith('user-2', projectId, user);
    expect(
      taskAssigneePolicy.assertAssigneeCanBeAssignedToProjectOrThrow,
    ).toHaveBeenCalledWith('user-1', projectId, user);

    expect(taskDomainEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _tag: 'TaskCreated',
        assigneeUserIdsToNotify: ['user-2'],
      }),
    );
  });
});

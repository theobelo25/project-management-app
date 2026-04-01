import { PinoLogger } from 'nestjs-pino';
import { TaskPriority, TaskStatus } from '@repo/database';
import { AuthUser, TaskAssignmentView } from '@repo/types';

import { AssignTaskUserUseCase } from './assign-task-user.use-case';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskAssigneePolicy } from '../policies/task-assignee-policy';
import { TaskDomainEventPublisher } from '../events/task-domain-event.publisher';
import type {
  TaskAssignmentResultEntity,
  TaskEntity,
} from '../domain/task.entity';

function taskEntityFixture(): TaskEntity {
  const now = new Date('2026-03-01T12:00:00.000Z');
  return {
    id: 'task-1',
    projectId: '550e8400-e29b-41d4-a716-446655440002',
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

function assignmentResult(created: boolean): TaskAssignmentResultEntity {
  const assignedAt = new Date('2026-03-01T12:00:00.000Z');
  return {
    created,
    assignment: {
      taskId: 'task-1',
      userId: 'user-2',
      assignedAt,
      user: {
        id: 'user-2',
        name: 'Assignee',
        email: 'a@example.com',
      },
      task: {
        title: 'Task',
        projectId: '550e8400-e29b-41d4-a716-446655440002',
      },
    },
  };
}

describe('AssignTaskUserUseCase', () => {
  let useCase: AssignTaskUserUseCase;

  let tasksRepository: {
    findByIdOrThrow: jest.Mock;
    assignUser: jest.Mock;
  };
  let taskAssigneePolicy: {
    assertAssigneeCanBeAssignedToProjectOrThrow: jest.Mock;
  };
  let taskDomainEventPublisher: { publish: jest.Mock };
  let logger: { info: jest.Mock };

  const currentUser: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    tasksRepository = {
      findByIdOrThrow: jest.fn(),
      assignUser: jest.fn(),
    };
    taskAssigneePolicy = {
      assertAssigneeCanBeAssignedToProjectOrThrow: jest
        .fn()
        .mockResolvedValue(undefined),
    };
    taskDomainEventPublisher = { publish: jest.fn() };
    logger = { info: jest.fn() };

    useCase = new AssignTaskUserUseCase(
      tasksRepository as unknown as TasksRepository,
      taskAssigneePolicy as unknown as TaskAssigneePolicy,
      taskDomainEventPublisher as unknown as TaskDomainEventPublisher,
      logger as unknown as PinoLogger,
    );
  });

  it('when assignment is new: validates member, assigns, logs, publishes, returns view', async () => {
    tasksRepository.findByIdOrThrow.mockResolvedValue(taskEntityFixture());
    tasksRepository.assignUser.mockResolvedValue(assignmentResult(true));

    const result = await useCase.execute('task-1', 'user-2', currentUser);

    expect(
      taskAssigneePolicy.assertAssigneeCanBeAssignedToProjectOrThrow,
    ).toHaveBeenCalledWith(
      'user-2',
      '550e8400-e29b-41d4-a716-446655440002',
      currentUser,
    );

    expect(taskDomainEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _tag: 'TaskAssigneeAdded',
        taskId: 'task-1',
        assigneeUserId: 'user-2',
        notifyAssignee: true,
      }),
    );

    expect(logger.info).toHaveBeenCalled();
    expect(result).toMatchObject({
      taskId: 'task-1',
      userId: 'user-2',
    } satisfies Partial<TaskAssignmentView>);
  });

  it('when assignee already exists: no log or domain event (idempotent assign)', async () => {
    tasksRepository.findByIdOrThrow.mockResolvedValue(taskEntityFixture());
    tasksRepository.assignUser.mockResolvedValue(assignmentResult(false));

    await useCase.execute('task-1', 'user-2', currentUser);

    expect(taskDomainEventPublisher.publish).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });
});

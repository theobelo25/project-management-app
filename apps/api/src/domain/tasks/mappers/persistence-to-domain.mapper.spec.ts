import { TaskPriority, TaskStatus } from '@repo/database';

import {
  mapTaskAssignmentPersistenceToEntity,
  mapTaskWithAssigneesToEntity,
} from './persistence-to-domain.mapper';
import type {
  TaskAssignmentPersistenceResult,
  TaskWithAssignees,
} from '../types/tasks.repository.types';

describe('persistence-to-domain.mapper', () => {
  it('mapTaskWithAssigneesToEntity strips ORM coupling to a plain domain shape', () => {
    const assignedAt = new Date('2026-03-01T10:00:00.000Z');
    const createdAt = new Date('2026-03-01T09:00:00.000Z');
    const updatedAt = new Date('2026-03-01T11:00:00.000Z');

    const row = {
      id: 't1',
      projectId: 'p1',
      title: 'Hello',
      description: null,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      labelColor: null,
      dueDate: null,
      position: 3,
      createdAt,
      updatedAt,
      createdById: 'u1',
      assignees: [
        {
          taskId: 't1',
          userId: 'u2',
          assignedAt,
          user: {
            id: 'u2',
            name: 'Sam',
            email: 'sam@example.com',
          },
        },
      ],
    } as unknown as TaskWithAssignees;

    const entity = mapTaskWithAssigneesToEntity(row);

    expect(entity).toEqual({
      id: 't1',
      projectId: 'p1',
      title: 'Hello',
      description: null,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      labelColor: null,
      dueDate: null,
      position: 3,
      createdAt,
      updatedAt,
      createdById: 'u1',
      assignees: [
        {
          userId: 'u2',
          assignedAt,
          user: { id: 'u2', name: 'Sam', email: 'sam@example.com' },
        },
      ],
    });
  });

  it('mapTaskAssignmentPersistenceToEntity preserves task slice for downstream events', () => {
    const assignedAt = new Date('2026-03-01T10:00:00.000Z');
    const raw: TaskAssignmentPersistenceResult = {
      created: true,
      assignment: {
        taskId: 't1',
        userId: 'u2',
        assignedAt,
        user: { id: 'u2', name: 'Sam', email: 'sam@example.com' },
        task: { title: 'Do work', projectId: 'p1' },
      } as TaskAssignmentPersistenceResult['assignment'],
    };
    const mapped = mapTaskAssignmentPersistenceToEntity(raw);

    expect(mapped.created).toBe(true);
    expect(mapped.assignment.task).toEqual({
      title: 'Do work',
      projectId: 'p1',
    });
  });
});

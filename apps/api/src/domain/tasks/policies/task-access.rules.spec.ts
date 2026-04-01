import { ProjectRole } from '@repo/database';

import { TaskAccessRules } from './task-access.rules';
import type { TaskAccessContext } from '../types/tasks.repository.types';

const rules = new TaskAccessRules();

function taskContext(
  patch: Partial<TaskAccessContext> = {},
): TaskAccessContext {
  return {
    id: 'task-1',
    projectId: 'project-1',
    createdById: 'creator-1',
    assignees: [],
    project: {
      orgId: 'org-1',
      ownerId: 'owner-1',
      currentUserRole: ProjectRole.MEMBER,
    },
    ...patch,
  } as TaskAccessContext;
}

describe('TaskAccessRules', () => {
  describe('canReadProject', () => {
    it.each([
      ['no role', null, false],
      ['undefined role', undefined, false],
      ['member', ProjectRole.MEMBER, true],
      ['admin', ProjectRole.ADMIN, true],
      ['owner enum', ProjectRole.OWNER, true],
    ] as const)('%s', (_label, role, expected) => {
      expect(rules.canReadProject(role)).toBe(expected);
    });
  });

  describe('canCreateProject', () => {
    it.each([
      ['no role', null, false],
      ['member', ProjectRole.MEMBER, true],
      ['admin', ProjectRole.ADMIN, true],
      ['owner', ProjectRole.OWNER, true],
    ] as const)('%s', (_label, role, expected) => {
      expect(rules.canCreateProject(role)).toBe(expected);
    });
  });

  describe('canReadTask', () => {
    it('allows project owner even without membership role on payload', () => {
      const task = taskContext({
        project: {
          orgId: 'org-1',
          ownerId: 'owner-1',
          currentUserRole: null,
        },
      });
      expect(rules.canReadTask(task, 'owner-1')).toBe(true);
    });

    it('allows member when currentUserRole is set', () => {
      const task = taskContext({
        project: {
          orgId: 'org-1',
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });
      expect(rules.canReadTask(task, 'member-1')).toBe(true);
    });

    it('denies user with no owner match and no role', () => {
      const task = taskContext({
        project: {
          orgId: 'org-1',
          ownerId: 'owner-1',
          currentUserRole: null,
        },
      });
      expect(rules.canReadTask(task, 'stranger')).toBe(false);
    });
  });

  describe('canUpdateTask', () => {
    it.each([
      {
        name: 'project owner',
        userId: 'owner-1',
        role: null as ProjectRole | null,
        assignees: [] as { userId: string }[],
        expected: true,
      },
      {
        name: 'project admin',
        userId: 'u1',
        role: ProjectRole.ADMIN,
        assignees: [],
        expected: true,
      },
      {
        name: 'assignee (member)',
        userId: 'u1',
        role: ProjectRole.MEMBER,
        assignees: [{ userId: 'u1' }],
        expected: true,
      },
      {
        name: 'member not assignee',
        userId: 'u1',
        role: ProjectRole.MEMBER,
        assignees: [{ userId: 'u2' }],
        expected: false,
      },
    ])('$name', ({ userId, role, assignees, expected }) => {
      const task = taskContext({
        assignees,
        project: {
          orgId: 'org-1',
          ownerId: 'owner-1',
          currentUserRole: role,
        },
      });
      expect(rules.canUpdateTask(task, userId)).toBe(expected);
    });
  });

  describe('canDeleteTask', () => {
    it.each([
      {
        name: 'owner',
        userId: 'owner-1',
        role: null as ProjectRole | null,
        createdById: 'other',
        expected: true,
      },
      {
        name: 'admin',
        userId: 'u1',
        role: ProjectRole.ADMIN,
        createdById: 'other',
        expected: true,
      },
      {
        name: 'creator (member)',
        userId: 'u1',
        role: ProjectRole.MEMBER,
        createdById: 'u1',
        expected: true,
      },
      {
        name: 'member not creator',
        userId: 'u1',
        role: ProjectRole.MEMBER,
        createdById: 'other',
        expected: false,
      },
    ])('$name', ({ userId, role, createdById, expected }) => {
      const task = taskContext({
        createdById,
        project: {
          orgId: 'org-1',
          ownerId: 'owner-1',
          currentUserRole: role,
        },
      });
      expect(rules.canDeleteTask(task, userId)).toBe(expected);
    });
  });

  describe('canManageTask', () => {
    it.each([
      ['owner', 'owner-1', null, true],
      ['admin', 'u1', ProjectRole.ADMIN, true],
      ['member', 'u1', ProjectRole.MEMBER, false],
    ] as const)('%s', (_label, userId, role, expected) => {
      const task = taskContext({
        project: {
          orgId: 'org-1',
          ownerId: 'owner-1',
          currentUserRole: role,
        },
      });
      expect(rules.canManageTask(task, userId)).toBe(expected);
    });
  });

  describe('canUnassignOwnTask', () => {
    it.each([
      ['assigned', [{ userId: 'u1' }], 'u1', true],
      ['not assigned', [{ userId: 'u2' }], 'u1', false],
      ['empty assignees', [], 'u1', false],
    ] as const)('%s', (_label, assignees, userId, expected) => {
      const task = taskContext({ assignees });
      expect(rules.canUnassignOwnTask(task, userId)).toBe(expected);
    });
  });
});

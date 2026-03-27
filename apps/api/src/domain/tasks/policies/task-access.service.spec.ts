import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProjectRole } from '@repo/database';
import { AuthUser } from '@repo/types';

import { TaskAccessService } from './task-access.service';
import { TaskAccessContext } from '../types/tasks.repository.types';
import { TaskAccessRules } from './task-access.rules';
import { TaskAccessContextLoader } from './task-access-context.loader';

describe('TaskAccessService', () => {
  let service: TaskAccessService;
  let loader: {
    findProjectWithMemberRole: jest.Mock;
    findTaskAccessContext: jest.Mock;
  };
  let logger: { warn: jest.Mock; debug: jest.Mock };

  const user: AuthUser = { id: 'user-1', orgId: 'org-1' };

  const taskFixture = (
    patch: Partial<TaskAccessContext> = {},
  ): TaskAccessContext =>
    ({
      id: 'task-1',
      projectId: 'project-1',
      createdById: 'creator-1',
      assignees: [],
      project: {
        orgId: user.orgId,
        ownerId: 'owner-1',
        currentUserRole: ProjectRole.MEMBER,
      },
      ...patch,
    }) as TaskAccessContext;

  beforeEach(() => {
    logger = { warn: jest.fn(), debug: jest.fn() };
    loader = {
      findProjectWithMemberRole: jest.fn(),
      findTaskAccessContext: jest.fn(),
    };

    service = new TaskAccessService(
      loader as any,
      logger as any,
      new TaskAccessRules(),
    );
  });

  it('create: owner passes; missing project 404; no role 403', async () => {
    loader.findProjectWithMemberRole.mockResolvedValueOnce({
      id: 'project-1',
      ownerId: user.id,
      currentUserRole: null,
    });
    await service.assertCanCreateInProject(user, 'project-1');

    loader.findProjectWithMemberRole.mockResolvedValueOnce(null);
    await expect(service.assertCanCreateInProject(user, 'p')).rejects.toThrow(
      NotFoundException,
    );

    loader.findProjectWithMemberRole.mockResolvedValueOnce({
      id: 'project-1',
      ownerId: 'someone-else',
      currentUserRole: null,
    });
    await expect(service.assertCanCreateInProject(user, 'project-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('read task: happy path, missing task, wrong org', async () => {
    const ok = taskFixture({
      project: { orgId: user.orgId, ownerId: user.id, currentUserRole: null },
    });
    loader.findTaskAccessContext.mockResolvedValueOnce(ok);
    await expect(service.getAccessibleTaskOrThrow('task-1', user)).resolves.toBe(ok);

    loader.findTaskAccessContext.mockResolvedValueOnce(null);
    await expect(service.getAccessibleTaskOrThrow('task-1', user)).rejects.toThrow(
      NotFoundException,
    );

    loader.findTaskAccessContext.mockResolvedValueOnce(
      taskFixture({
        project: {
          orgId: 'nope',
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      }),
    );
    await expect(service.getAccessibleTaskOrThrow('task-1', user)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('update: random member with no stake gets blocked', async () => {
    loader.findTaskAccessContext.mockResolvedValue(
      taskFixture({
        createdById: 'other',
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
        assignees: [],
      }),
    );

    await expect(service.assertCanUpdate('task-1', user)).rejects.toThrow(
      ForbiddenException,
    );
  });
});

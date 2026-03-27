import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthUser } from '@repo/types';

import { TaskAccessGuard } from './task-access.guard';
import { TaskAccessService } from '../policies/task-access.service';

describe('TaskAccessGuard', () => {
  let guard: TaskAccessGuard;

  let reflector: {
    getAllAndOverride: jest.Mock;
  };

  let taskAccessService: {
    assertCanCreateInProject: jest.Mock;
    assertCanReadProject: jest.Mock;
    assertCanRead: jest.Mock;
    assertCanUpdate: jest.Mock;
    assertCanDelete: jest.Mock;
    assertCanAssign: jest.Mock;
    assertCanUnassign: jest.Mock;
  };

  const user: AuthUser = { id: 'user-1', orgId: 'org-1' } as AuthUser;

  const makeContext = (request: any): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };

    taskAccessService = {
      assertCanCreateInProject: jest.fn().mockResolvedValue(undefined),
      assertCanReadProject: jest.fn().mockResolvedValue(undefined),
      assertCanRead: jest.fn().mockResolvedValue(undefined),
      assertCanUpdate: jest.fn().mockResolvedValue(undefined),
      assertCanDelete: jest.fn().mockResolvedValue(undefined),
      assertCanAssign: jest.fn().mockResolvedValue(undefined),
      assertCanUnassign: jest.fn().mockResolvedValue(undefined),
    };

    guard = new TaskAccessGuard(
      reflector as unknown as Reflector,
      taskAccessService as unknown as TaskAccessService,
    );
  });

  it('returns false when no action metadata is present', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const ctx = makeContext({
      user,
      params: {},
      query: {},
      body: {},
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(false);
    expect(taskAccessService.assertCanCreateInProject).not.toHaveBeenCalled();
    expect(taskAccessService.assertCanReadProject).not.toHaveBeenCalled();
    expect(taskAccessService.assertCanRead).not.toHaveBeenCalled();
    expect(taskAccessService.assertCanUpdate).not.toHaveBeenCalled();
    expect(taskAccessService.assertCanDelete).not.toHaveBeenCalled();
    expect(taskAccessService.assertCanAssign).not.toHaveBeenCalled();
    expect(taskAccessService.assertCanUnassign).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when auth context is missing', async () => {
    reflector.getAllAndOverride.mockReturnValue('readTask');

    const ctx = makeContext({
      // missing user.id/orgId
      user: { id: undefined, orgId: undefined },
      params: { taskId: 'task-1' },
      query: {},
      body: {},
    });

    try {
      await guard.canActivate(ctx);
      fail('Expected canActivate to throw');
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);

      const resp = (e as UnauthorizedException).getResponse() as any;
      expect(resp.details?.code).toBe('TASK_ACCESS_CONTEXT_MISSING');
    }
  });

  it('createInProject parses body.projectId and calls assertCanCreateInProject', async () => {
    reflector.getAllAndOverride.mockReturnValue('createInProject');

    const ctx = makeContext({
      user,
      params: {},
      query: {},
      body: { projectId: 'project-1' },
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(taskAccessService.assertCanCreateInProject).toHaveBeenCalledWith(
      user,
      'project-1',
    );
  });

  it('readProject parses query.projectId and calls assertCanReadProject', async () => {
    reflector.getAllAndOverride.mockReturnValue('readProject');

    const ctx = makeContext({
      user,
      params: {},
      query: { projectId: 'project-1' },
      body: {},
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(taskAccessService.assertCanReadProject).toHaveBeenCalledWith(
      user,
      'project-1',
    );
  });

  it('readTask parses params.taskId and calls assertCanRead', async () => {
    reflector.getAllAndOverride.mockReturnValue('readTask');

    const ctx = makeContext({
      user,
      params: { taskId: 'task-1' },
      query: {},
      body: {},
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(taskAccessService.assertCanRead).toHaveBeenCalledWith(
      'task-1',
      user,
    );
  });

  it('updateTask parses params.taskId and calls assertCanUpdate', async () => {
    reflector.getAllAndOverride.mockReturnValue('updateTask');

    const ctx = makeContext({
      user,
      params: { taskId: 'task-1' },
      query: {},
      body: {},
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(taskAccessService.assertCanUpdate).toHaveBeenCalledWith(
      'task-1',
      user,
    );
  });

  it('deleteTask parses params.taskId and calls assertCanDelete', async () => {
    reflector.getAllAndOverride.mockReturnValue('deleteTask');

    const ctx = makeContext({
      user,
      params: { taskId: 'task-1' },
      query: {},
      body: {},
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(taskAccessService.assertCanDelete).toHaveBeenCalledWith(
      'task-1',
      user,
    );
  });

  it('assignTask parses params.taskId and calls assertCanAssign', async () => {
    reflector.getAllAndOverride.mockReturnValue('assignTask');

    const ctx = makeContext({
      user,
      params: { taskId: 'task-1' },
      query: {},
      body: {},
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(taskAccessService.assertCanAssign).toHaveBeenCalledWith(
      'task-1',
      user,
    );
  });

  it('unassignTask parses params.taskId + params.userId and calls assertCanUnassign', async () => {
    reflector.getAllAndOverride.mockReturnValue('unassignTask');

    const ctx = makeContext({
      user,
      params: { taskId: 'task-1', userId: 'assignee-1' },
      query: {},
      body: {},
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(taskAccessService.assertCanUnassign).toHaveBeenCalledWith(
      'task-1',
      user,
      'assignee-1',
    );
  });

  it('createInProject throws BadRequestException when body.projectId is invalid', async () => {
    reflector.getAllAndOverride.mockReturnValue('createInProject');

    const ctx = makeContext({
      user,
      params: {},
      query: {},
      body: { projectId: '' },
    });

    try {
      await guard.canActivate(ctx);
      fail('Expected canActivate to throw');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const resp = (e as BadRequestException).getResponse() as any;
      expect(resp.details?.code).toBe('TASK_INVALID_PROJECT_ID');
    }
  });

  it('readTask throws BadRequestException when params.taskId is an array', async () => {
    reflector.getAllAndOverride.mockReturnValue('readTask');

    const ctx = makeContext({
      user,
      params: { taskId: ['task-1'] },
      query: {},
      body: {},
    });

    try {
      await guard.canActivate(ctx);
      fail('Expected canActivate to throw');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const resp = (e as BadRequestException).getResponse() as any;
      expect(resp.details?.code).toBe('TASK_INVALID_TASK_ID');
    }
  });

  it('unassignTask throws BadRequestException when params.userId is missing/invalid', async () => {
    reflector.getAllAndOverride.mockReturnValue('unassignTask');

    const ctx = makeContext({
      user,
      params: { taskId: 'task-1', userId: ['assignee-1'] },
      query: {},
      body: {},
    });

    try {
      await guard.canActivate(ctx);
      fail('Expected canActivate to throw');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const resp = (e as BadRequestException).getResponse() as any;
      expect(resp.details?.code).toBe('TASK_INVALID_ASSIGNEE_USER_ID');
    }
  });
});

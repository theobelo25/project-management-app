import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { AuthUser } from '@repo/types';
import { TaskAccessService } from '../policies/task-access.service';
import {
  REQUIRE_TASK_ACCESS_KEY,
  type TaskAccessAction,
} from '../decorators/require-task-access.decorator';
import {
  parseRequiredAssigneeUserIdFromParams,
  parseRequiredProjectIdFromBody,
  parseRequiredProjectIdFromQuery,
  parseRequiredTaskIdFromParams,
} from './task-access.params';

type RequestWithUser = Request & {
  user?: AuthUser;
  params: Record<string, string | string[] | undefined>;
  query: Record<string, unknown>;
  body: Record<string, unknown>;
};

type ActionHandler = (args: {
  user: AuthUser;
  request: RequestWithUser;
}) => Promise<void>;

const ALL_ACTIONS: TaskAccessAction[] = [
  'createInProject',
  'readProject',
  'readTask',
  'updateTask',
  'deleteTask',
  'assignTask',
  'unassignTask',
];

function isTaskAccessAction(value: unknown): value is TaskAccessAction {
  return typeof value === 'string' && (ALL_ACTIONS as string[]).includes(value);
}

@Injectable()
export class TaskAccessGuard implements CanActivate {
  private readonly handlers: Record<TaskAccessAction, ActionHandler>;

  constructor(
    private readonly reflector: Reflector,
    private readonly taskAccessService: TaskAccessService,
  ) {
    this.handlers = {
      createInProject: async ({ user, request }) => {
        const projectId = parseRequiredProjectIdFromBody(request.body);
        await this.taskAccessService.assertCanCreateInProject(user, projectId);
      },

      readProject: async ({ user, request }) => {
        const projectId = parseRequiredProjectIdFromQuery(request.query);
        await this.taskAccessService.assertCanReadProject(user, projectId);
      },

      readTask: async ({ user, request }) => {
        const taskId = parseRequiredTaskIdFromParams(request.params);
        await this.taskAccessService.assertCanRead(taskId, user);
      },

      updateTask: async ({ user, request }) => {
        const taskId = parseRequiredTaskIdFromParams(request.params);
        await this.taskAccessService.assertCanUpdate(taskId, user);
      },

      deleteTask: async ({ user, request }) => {
        const taskId = parseRequiredTaskIdFromParams(request.params);
        await this.taskAccessService.assertCanDelete(taskId, user);
      },

      assignTask: async ({ user, request }) => {
        const taskId = parseRequiredTaskIdFromParams(request.params);
        await this.taskAccessService.assertCanAssign(taskId, user);
      },

      unassignTask: async ({ user, request }) => {
        const taskId = parseRequiredTaskIdFromParams(request.params);
        const assigneeUserId = parseRequiredAssigneeUserIdFromParams(
          request.params,
        );

        await this.taskAccessService.assertCanUnassign(
          taskId,
          user,
          assigneeUserId,
        );
      },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const raw = this.reflector.getAllAndOverride<unknown>(
      REQUIRE_TASK_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (raw === undefined || raw === null) {
      return false;
    }

    if (!isTaskAccessAction(raw)) {
      return false;
    }

    const action = raw;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.id || !user?.orgId) {
      throw new UnauthorizedException({
        message: 'Missing auth context',
        details: { code: 'TASK_ACCESS_CONTEXT_MISSING' },
      });
    }

    await this.handlers[action]({ user, request });
    return true;
  }
}

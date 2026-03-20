import { BadRequestException } from '@nestjs/common';
import { getSingleParam } from '@api/common/utils/http.utils';

type Params = Record<string, string | string[] | undefined>;
type Body = Record<string, unknown>;
type Query = Record<string, unknown>;

export function parseRequiredProjectIdFromBody(body: Body): string {
  const projectId = body?.projectId;

  if (typeof projectId !== 'string' || !projectId) {
    throw new BadRequestException({
      message: 'Invalid projectId',
      details: { code: 'TASK_INVALID_PROJECT_ID' },
    });
  }

  return projectId;
}

export function parseRequiredProjectIdFromQuery(query: Query): string {
  const projectId = query?.projectId;

  if (typeof projectId !== 'string' || !projectId) {
    throw new BadRequestException({
      message: 'Invalid projectId',
      details: { code: 'TASK_INVALID_PROJECT_ID' },
    });
  }

  return projectId;
}

export function parseRequiredTaskIdFromParams(params: Params): string {
  const taskId = getSingleParam(params.taskId);

  if (!taskId) {
    throw new BadRequestException({
      message: 'Invalid taskId',
      details: { code: 'TASK_INVALID_TASK_ID' },
    });
  }

  return taskId;
}

export function parseRequiredAssigneeUserIdFromParams(params: Params): string {
  const assigneeUserId = getSingleParam(params.userId);

  if (!assigneeUserId) {
    throw new BadRequestException({
      message: 'Invalid userId',
      details: { code: 'TASK_INVALID_ASSIGNEE_USER_ID' },
    });
  }

  return assigneeUserId;
}

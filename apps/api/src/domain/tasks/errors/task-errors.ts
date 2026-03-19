import { ForbiddenException, NotFoundException } from '@nestjs/common';

type Details = Record<string, unknown>;

const TASK_NOT_FOUND_ERRORS = {
  PROJECT_NOT_FOUND: {
    message: 'Project not found',
    code: 'TASK_ACCESS_PROJECT_NOT_FOUND',
  },
  TASK_NOT_FOUND: {
    message: 'Task not found',
    code: 'TASK_ACCESS_TASK_NOT_FOUND',
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    code: 'TASK_ASSIGN_USER_NOT_FOUND',
  },
} as const;

const TASK_FORBIDDEN_ERRORS = {
  CREATE_PROJECT_FORBIDDEN_NO_ACCESS: {
    message: 'You do not have access to the project',
    code: 'TASK_ACCESS_CREATE_PROJECT_FORBIDDEN_NO_ACCESS',
  },
  CREATE_PROJECT_FORBIDDEN_NO_PERMISSION: {
    message: 'You do not have permission to create tasks in this project',
    code: 'TASK_ACCESS_CREATE_PROJECT_FORBIDDEN_NO_PERMISSION',
  },
  READ_PROJECT_FORBIDDEN: {
    message: 'You do not have access to this project',
    code: 'TASK_ACCESS_READ_PROJECT_FORBIDDEN',
  },
  READ_TASK_FORBIDDEN: {
    message: 'You do not have access to this task',
    code: 'TASK_ACCESS_READ_TASK_FORBIDDEN',
  },
  UPDATE_TASK_FORBIDDEN: {
    message: 'You do not have permission to update this task',
    code: 'TASK_ACCESS_UPDATE_TASK_FORBIDDEN',
  },
  DELETE_TASK_FORBIDDEN: {
    message: 'You do not have permission to delete this task',
    code: 'TASK_ACCESS_DELETE_TASK_FORBIDDEN',
  },
  ASSIGN_TASK_FORBIDDEN: {
    message: 'You do not have permission to assign this task',
    code: 'TASK_ACCESS_ASSIGN_TASK_FORBIDDEN',
  },
  UNASSIGN_TASK_FORBIDDEN: {
    message: 'You do not have permission to unassign this task',
    code: 'TASK_ACCESS_UNASSIGN_TASK_FORBIDDEN',
  },
  ASSIGN_USER_FORBIDDEN_OTHER_ORG: {
    message: 'Cannot assign users from another organization',
    code: 'TASK_ASSIGN_USER_FORBIDDEN_OTHER_ORG',
  },
} as const;

type TaskNotFoundKey = keyof typeof TASK_NOT_FOUND_ERRORS;
type TaskForbiddenKey = keyof typeof TASK_FORBIDDEN_ERRORS;

export function taskNotFound(
  key: TaskNotFoundKey,
  details?: Details,
): NotFoundException {
  const def = TASK_NOT_FOUND_ERRORS[key];

  return new NotFoundException({
    message: def.message,
    details: {
      code: def.code,
      ...(details ?? {}),
    },
  });
}

export function taskForbidden(
  key: TaskForbiddenKey,
  details?: Details,
): ForbiddenException {
  const def = TASK_FORBIDDEN_ERRORS[key];

  return new ForbiddenException({
    message: def.message,
    details: {
      code: def.code,
      ...(details ?? {}),
    },
  });
}

import { SetMetadata } from '@nestjs/common';

export const REQUIRE_TASK_ACCESS_KEY = 'requireTaskAccess';

export type TaskAccessAction =
  | 'createInProject'
  | 'readProject'
  | 'readTask'
  | 'updateTask'
  | 'deleteTask'
  | 'assignTask'
  | 'unassignTask';

export const RequireTaskAccess = (action: TaskAccessAction) =>
  SetMetadata(REQUIRE_TASK_ACCESS_KEY, action);

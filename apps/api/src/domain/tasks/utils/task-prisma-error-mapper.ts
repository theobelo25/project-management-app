import { Prisma } from '@repo/database';
import { taskNotFound } from '../errors/task-errors';

function getPrismaErrorCode(err: unknown): string | undefined {
  const maybe = err as any;
  if (!maybe || typeof maybe !== 'object') return undefined;
  return typeof maybe.code === 'string' ? maybe.code : undefined;
}

function getPrismaErrorMeta(err: unknown): Record<string, unknown> | undefined {
  const maybe = err as any;
  if (!maybe || typeof maybe !== 'object') return undefined;
  const meta = maybe.meta;
  if (!meta || typeof meta !== 'object') return undefined;
  return meta as Record<string, unknown>;
}

export function throwTaskNotFoundOnPrismaP2025(
  err: unknown,
  params: { taskId: string; userId: string },
): never {
  const code = getPrismaErrorCode(err);

  if (
    code === 'P2025' ||
    (err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025')
  ) {
    throw taskNotFound('TASK_NOT_FOUND', {
      taskId: params.taskId,
      userId: params.userId,
    });
  }

  throw err;
}

export function throwTaskNotFoundOnPrismaAssignOrUnassignErrors(
  err: unknown,
  params: { taskId: string; assigneeUserId: string; requesterUserId: string },
): never {
  const code = getPrismaErrorCode(err);

  // If the FK-referenced record is gone, Prisma commonly throws P2003 (relation violation).
  if (
    code === 'P2003' ||
    (err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2003')
  ) {
    const meta = getPrismaErrorMeta(err);

    // Prisma typically includes field name in meta: e.g. { field_name: 'TaskAssignee_taskId_fkey' }
    const fieldName =
      (meta?.field_name as string | undefined) ??
      (meta?.fieldName as string | undefined) ??
      (meta?.constraint as string | undefined);

    if (typeof fieldName === 'string') {
      const lower = fieldName.toLowerCase();

      if (lower.includes('userid') || lower.includes('user_id')) {
        throw taskNotFound('USER_NOT_FOUND', {
          assigneeUserId: params.assigneeUserId,
        });
      }

      if (lower.includes('taskid') || lower.includes('task_id')) {
        throw taskNotFound('TASK_NOT_FOUND', {
          taskId: params.taskId,
          userId: params.requesterUserId,
        });
      }
    }

    // Fallback: treat relation violations as missing task.
    throw taskNotFound('TASK_NOT_FOUND', {
      taskId: params.taskId,
      userId: params.requesterUserId,
    });
  }

  if (
    code === 'P2025' ||
    (err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025')
  ) {
    throw taskNotFound('TASK_NOT_FOUND', {
      taskId: params.taskId,
      userId: params.requesterUserId,
    });
  }

  throw err;
}

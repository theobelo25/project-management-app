import type { ApiErrorResponse } from '@repo/types';

export function buildApiErrorResponse(input: {
  statusCode: number;
  message: string;
  error: string;
  path: string;
  timestamp?: string;
  details?: unknown;
}): ApiErrorResponse {
  return {
    statusCode: input.statusCode,
    message: input.message,
    error: input.error,
    timestamp: input.timestamp ?? new Date().toISOString(),
    path: input.path,
    ...(input.details !== undefined ? { details: input.details } : {}),
  };
}

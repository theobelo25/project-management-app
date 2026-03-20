import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { mapPrismaException } from '../mappers/prisma-exception.mapper';
import { extractHttpExceptionPayload } from './error-details.extractor';

export type NormalizedError = {
  statusCode: number;
  message: string;
  error: string;
  details?: unknown;
};

export function normalizeException(exception: unknown): NormalizedError {
  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = mapPrismaException(exception);
    return {
      statusCode: mapped.statusCode,
      message: mapped.message,
      error: mapped.error,
      ...(mapped.details !== undefined ? { details: mapped.details } : {}),
    };
  }

  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();
    const payload = extractHttpExceptionPayload(exception.getResponse());

    let message = exception.message || 'Request failed';
    let error = exception.name || 'Error';
    let details: unknown | undefined;

    if (payload) {
      if (payload.validationMessages) {
        message = 'Validation failed';
        error = payload.error ?? exception.name;
        details = payload.validationMessages;
      } else {
        message = payload.message ?? message;
        error = payload.error ?? error;
        if (payload.details !== undefined) details = payload.details;
        else if (payload.errors !== undefined) details = payload.errors;
      }
    }
    return {
      statusCode,
      message,
      error,
      ...(details !== undefined ? { details } : {}),
    };
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    error: 'Internal Server Error',
  };
}

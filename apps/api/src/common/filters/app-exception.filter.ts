import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@repo/database';
import { Request, Response } from 'express';
import { mapPrismaException } from '../mappers/prisma-exception.mapper';
import { ApiErrorResponse } from '../types/api-error-response.type';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let payload: ApiErrorResponse;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = mapPrismaException(exception);

      payload = {
        statusCode: mapped.statusCode,
        message: mapped.message,
        error: mapped.error,
        timestamp: new Date().toISOString(),
        path: request.url,
        details: mapped.details,
      };
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message = 'Request failed';
      let error = 'Error';
      let details: unknown;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const res = exceptionResponse as Record<string, unknown>;

        message =
          typeof res.message === 'string'
            ? res.message
            : Array.isArray(res.message)
              ? 'Validation failed'
              : exception.message;

        error = typeof res.error === 'string' ? res.error : exception.name;

        if (Array.isArray(res.message)) {
          details = res.message;
        } else if (res.details !== undefined) {
          details = res.details;
        }
      } else {
        message = exception.message;
        error = exception.name;
      }

      payload = {
        statusCode: status,
        message,
        error,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(details !== undefined ? { details } : {}),
      };
    } else {
      payload = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    response.status(payload.statusCode).json(payload);
  }
}

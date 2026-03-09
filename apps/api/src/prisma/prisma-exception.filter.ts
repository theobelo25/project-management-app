import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@repo/database';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;

        const target = Array.isArray(exception.meta?.target)
          ? exception.meta.target.join(', ')
          : 'field';

        message = `Unique constraint failed on: ${target}`;
        break;
      }

      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      }

      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Database error';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

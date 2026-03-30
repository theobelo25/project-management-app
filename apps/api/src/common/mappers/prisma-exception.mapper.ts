import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@repo/database';

type MappedPrismaError = {
  statusCode: number;
  message: string;
  error: string;
  details?: unknown;
};

export function mapPrismaException(
  exception: Prisma.PrismaClientKnownRequestError,
): MappedPrismaError {
  switch (exception.code) {
    case 'P2002':
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Resource already exists',
        error: 'Conflict',
        details: exception.meta,
      };

    case 'P2025':
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
        error: 'Not Found',
      };

    case 'P2003':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid relation reference',
        error: 'Bad Request',
        details: exception.meta,
      };

    case 'P2022':
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          'Database schema is out of date (missing column or type). Run migrations.',
        error: 'Internal Server Error',
        details: exception.meta,
      };

    default:
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error',
      };
  }
}

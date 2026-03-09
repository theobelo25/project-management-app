import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { mapPrismaException } from './prisma-exception.mapper';

function createPrismaKnownRequestError(
  code: string,
  meta?: Record<string, unknown>,
): Prisma.PrismaClientKnownRequestError {
  const error = Object.create(
    Prisma.PrismaClientKnownRequestError.prototype,
  ) as Prisma.PrismaClientKnownRequestError & {
    code: string;
    meta?: Record<string, unknown>;
    clientVersion: string;
    message: string;
    name: string;
  };

  Object.assign(error, {
    code,
    meta,
    clientVersion: 'test',
    message: `Prisma error ${code}`,
    name: 'PrismaClientKnownRequestError',
  });

  return error;
}

describe('mapPrismaException', () => {
  it('maps P2002 to 409 Conflict', () => {
    const exception = createPrismaKnownRequestError('P2002', {
      target: ['email'],
    });

    const result = mapPrismaException(exception);

    expect(result).toEqual({
      statusCode: HttpStatus.CONFLICT,
      message: 'Resource already exists',
      error: 'Conflict',
      details: { target: ['email'] },
    });
  });

  it('maps P2025 to 404 Not Found', () => {
    const exception = createPrismaKnownRequestError('P2025');

    const result = mapPrismaException(exception);

    expect(result).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Resource not found',
      error: 'Not Found',
    });
  });

  it('maps P2003 to 400 Bad Request', () => {
    const exception = createPrismaKnownRequestError('P2003', {
      field_name: 'projectId',
    });

    const result = mapPrismaException(exception);

    expect(result).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid relation reference',
      error: 'Bad Request',
      details: { field_name: 'projectId' },
    });
  });

  it('maps unknown Prisma codes to 500 Internal Server Error', () => {
    const exception = createPrismaKnownRequestError('P9999');

    const result = mapPrismaException(exception);

    expect(result).toEqual({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  });
});

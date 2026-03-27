import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { AppLogger } from '@api/logger/app.logger.interface';
import { AppExceptionFilter } from './app-exception.filter';

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

describe('AppExceptionFilter', () => {
  let filter: AppExceptionFilter;

  const mockLogger: AppLogger = {
    setContext: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    filter = new AppExceptionFilter(mockLogger);
    jest.useFakeTimers().setSystemTime(new Date('2026-03-09T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function createHost(url = '/api/test') {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    const response = {
      status,
      json,
    };

    const request = {
      url,
    };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost;

    return { host, response };
  }

  it('formats Prisma known request errors', () => {
    const exception = createPrismaKnownRequestError('P2002', {
      target: ['email'],
    });
    const { host, response } = createHost('/api/users');

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'Resource already exists',
      error: 'Conflict',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/users',
      details: { target: ['email'] },
    });
  });

  it('formats normal HttpExceptions', () => {
    const exception = new NotFoundException('User not found');
    const { host, response } = createHost('/api/users/123');

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User not found',
      error: 'Not Found',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/users/123',
    });
  });

  it('formats validation-style HttpExceptions with message arrays', () => {
    const exception = new BadRequestException(['email must be valid']);
    const { host, response } = createHost('/api/auth/signup');

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      error: 'Bad Request',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/auth/signup',
      details: ['email must be valid'],
    });
  });

  it('formats unknown errors as 500', () => {
    const exception = new Error('Boom');
    const { host, response } = createHost('/api/test');

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/test',
    });
  });

  it('formats object-based HttpException responses', () => {
    const exception = new BadRequestException({
      message: 'Custom bad request',
      error: 'Bad Request',
      details: { field: 'email' },
    });

    const { host, response } = createHost('/api/test');

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Custom bad request',
      error: 'Bad Request',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/test',
      details: { field: 'email' },
    });
  });
});

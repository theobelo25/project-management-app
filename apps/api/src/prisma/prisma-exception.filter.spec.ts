import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;

  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  const mockResponse = {
    status: mockStatus,
  };

  const mockRequest = {
    url: '/users/123',
  };

  const createArgumentsHost = (): ArgumentsHost =>
    ({
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    }) as ArgumentsHost;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
    jest.clearAllMocks();
  });

  const createPrismaKnownError = (
    code: string,
    meta?: Record<string, unknown>,
  ): Prisma.PrismaClientKnownRequestError => {
    return new Prisma.PrismaClientKnownRequestError('Prisma error', {
      code,
      clientVersion: 'test',
      meta,
    });
  };

  it('maps P2025 to 404 Not Found', () => {
    const exception = createPrismaKnownError('P2025');
    const host = createArgumentsHost();

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Record not found',
        error: 'P2025',
        path: '/users/123',
        timestamp: expect.any(String),
      }),
    );
  });

  it('maps P2002 to 409 Conflict with target field list', () => {
    const exception = createPrismaKnownError('P2002', {
      target: ['email'],
    });
    const host = createArgumentsHost();

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint failed on: email',
        error: 'P2002',
        path: '/users/123',
        timestamp: expect.any(String),
      }),
    );
  });

  it('maps P2002 to 409 Conflict with fallback field label when target is missing', () => {
    const exception = createPrismaKnownError('P2002');
    const host = createArgumentsHost();

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint failed on: field',
        error: 'P2002',
        path: '/users/123',
        timestamp: expect.any(String),
      }),
    );
  });

  it('maps unknown Prisma known errors to 500 Internal Server Error', () => {
    const exception = createPrismaKnownError('P9999');
    const host = createArgumentsHost();

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        error: 'P9999',
        path: '/users/123',
        timestamp: expect.any(String),
      }),
    );
  });
});

import {
  BadRequestException,
  Controller,
  Get,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Prisma } from '@repo/database';
import request from 'supertest';
import type { AppLogger } from '@api/logger/app.logger.interface';
import { AppExceptionFilter } from '../src/common/filters/app-exception.filter';

const mockLogger: AppLogger = {
  setContext: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

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

@Controller('test-errors')
class TestErrorsController {
  @Get('http')
  throwHttp() {
    throw new NotFoundException('User not found');
  }

  @Get('validation')
  throwValidation() {
    throw new BadRequestException(['email must be valid']);
  }

  @Get('prisma')
  throwPrisma() {
    throw createPrismaKnownRequestError('P2002', { target: ['email'] });
  }

  @Get('unknown')
  throwUnknown() {
    throw new Error('Unexpected failure');
  }
}

@Module({
  controllers: [TestErrorsController],
})
class TestAppModule {}

describe('AppExceptionFilter (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-09T12:00:00.000Z'));

    const moduleRef = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AppExceptionFilter(mockLogger));

    await app.init();
  });

  afterAll(async () => {
    jest.useRealTimers();
    await app.close();
  });

  it('standardizes HttpException responses', async () => {
    const res = await request(app.getHttpServer()).get('/api/test-errors/http');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/test-errors/http',
    });
  });

  it('standardizes validation responses', async () => {
    const res = await request(app.getHttpServer()).get(
      '/api/test-errors/validation',
    );

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/test-errors/validation',
      details: ['email must be valid'],
    });
  });

  it('standardizes Prisma exception responses', async () => {
    const res = await request(app.getHttpServer()).get(
      '/api/test-errors/prisma',
    );

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      statusCode: 409,
      message: 'Resource already exists',
      error: 'Conflict',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/test-errors/prisma',
      details: { target: ['email'] },
    });
  });

  it('standardizes unknown errors as 500', async () => {
    const res = await request(app.getHttpServer()).get(
      '/api/test-errors/unknown',
    );

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: '2026-03-09T12:00:00.000Z',
      path: '/api/test-errors/unknown',
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PRISMA } from '../src/prisma/types/prisma.constants';
import { PrismaClient } from '@repo/database';
import { COOKIE } from '../src/domain/auth/cookies/cookies.constants';
import cookieParser from 'cookie-parser';

describe('Auth E2E', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prisma = app.get(PRISMA);
  });

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('signup -> refresh -> logout -> refresh fails', async () => {
    const agent = request.agent(app.getHttpServer());

    const signupResponse = await agent.post('/auth/signup').send({
      email: 'theo@example.com',
      name: 'Theo',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'theo@example.com',
        name: 'Theo',
      }),
    );

    expectAuthCookies(signupResponse.headers['set-cookie']);

    const refreshResponse = await agent.post('/auth/refresh');

    expect(refreshResponse.status).toBe(201);
    expect(refreshResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'theo@example.com',
        name: 'Theo',
      }),
    );

    expectAuthCookies(refreshResponse.headers['set-cookie']);

    const logoutResponse = await agent.post('/auth/logout');

    expect(logoutResponse.status).toBe(201);
    expect(logoutResponse.body).toEqual({ success: true });

    const postLogoutRefreshResponse = await agent.post('/auth/refresh');

    expect(postLogoutRefreshResponse.status).toBe(401);
  });

  it('logs in an existing user and sets auth cookies', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'login@example.com',
      name: 'Login User',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    const agent = request.agent(app.getHttpServer());

    const response = await agent.post('/auth/login').send({
      email: 'login@example.com',
      password: 'Password123!',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'login@example.com',
        name: 'Login User',
      }),
    );

    expectAuthCookies(response.headers['set-cookie']);
  });
});

function expectAuthCookies(setCookie: string | string[] | undefined) {
  if (!setCookie) {
    throw new Error('Expected auth cookies to be set');
  }

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

  expect(cookies.some((c) => c.includes(COOKIE.AUTHENTICATION))).toBeTruthy();
  expect(cookies.some((c) => c.includes(COOKIE.REFRESH))).toBeTruthy();
}

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';

import { AppModule } from '../src/app.module';
import { PRISMA } from '../src/prisma/types/prisma.constants';
import { COOKIE } from '../src/domain/auth/cookies/cookies.constants';
import { prisma } from '@repo/database';

type PrismaDb = typeof prisma;

describe('Users E2E', () => {
  let app: INestApplication;
  let db: PrismaDb;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    db = app.get<PrismaDb>(PRISMA);
  });

  beforeEach(async () => {
    await db.refreshToken.deleteMany();
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.refreshToken.deleteMany();
    await db.user.deleteMany();
    await db.$disconnect();
    await app.close();
  });

  describe('GET /users', () => {
    it('returns 401 when unauthenticated', async () => {
      await request(app.getHttpServer()).get('/users').expect(401);
    });

    it('returns users when authenticated', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent.post('/auth/signup').send({
        email: 'owner@example.com',
        name: 'Owner User',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      await request(app.getHttpServer()).post('/auth/signup').send({
        email: 'second@example.com',
        name: 'Second User',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      const response = await agent.get('/users').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            email: 'owner@example.com',
            name: 'Owner User',
          }),
          expect.objectContaining({
            id: expect.any(String),
            email: 'second@example.com',
            name: 'Second User',
          }),
        ]),
      );
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user by id', async () => {
      const signupResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'findme@example.com',
          name: 'Find Me',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        })
        .expect(201);

      const userId = signupResponse.body.id as string;

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: userId,
          email: 'findme@example.com',
          name: 'Find Me',
        }),
      );
    });

    it('returns 400 for an invalid UUID', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/not-a-uuid')
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('returns null or 404 for a missing user id', async () => {
      const missingId = '11111111-1111-4111-8111-111111111111';

      const response = await request(app.getHttpServer()).get(
        `/users/${missingId}`,
      );

      expect([200, 404]).toContain(response.status);

      if (response.status === 200) {
        expect(response.body).toBeNull();
      }
    });
  });
});

function expectAuthCookies(setCookie: string | string[] | undefined) {
  if (!setCookie) {
    throw new Error('Expected auth cookies to be set');
  }

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

  expect(cookies.some((cookie) => cookie.includes(COOKIE.AUTHENTICATION))).toBe(
    true,
  );
  expect(cookies.some((cookie) => cookie.includes(COOKIE.REFRESH))).toBe(true);
}

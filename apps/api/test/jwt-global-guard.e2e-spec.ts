import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { ZodValidationPipe } from '@api/common';

const PLACEHOLDER_UUID = '11111111-1111-4111-8111-111111111111';

describe('JWT global guard (e2e safety net)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 401 for all non-public routes when unauthenticated', async () => {
    const expressApp = app.getHttpAdapter().getInstance() as any;
    const stack = expressApp?._router?.stack ?? [];

    const publicRoute = (method: string, path: string) => {
      const m = method.toUpperCase();
      const p = path.replace(/\/+$/, '');

      // Root + health checks
      if (m === 'GET' && (p === '' || p === '/' || p.endsWith('/api'))) return true;
      if (m === 'GET' && p.endsWith('/health')) return true;

      // Public auth routes
      if (m === 'POST' && p.includes('/auth/signup')) return true;
      if (m === 'POST' && p.includes('/auth/login')) return true;
      if (m === 'POST' && p.includes('/auth/refresh')) return true;
      if (m === 'POST' && p.includes('/auth/logout')) return true;

      return false;
    };

    const replaceParams = (path: string) =>
      path.replace(/:([A-Za-z0-9_]+)/g, PLACEHOLDER_UUID);

    const routes: Array<{ method: string; path: string }> = [];
    for (const layer of stack) {
      if (!layer?.route?.path) continue;

      const path: string = layer.route.path;
      const methods = layer.route.methods ?? {};

      for (const [method, enabled] of Object.entries(methods)) {
        if (!enabled) continue;
        if (!['get', 'post', 'patch', 'put', 'delete'].includes(method)) continue;

        routes.push({ method, path });
      }
    }

    const agent = request(app.getHttpServer());

    for (const { method, path } of routes) {
      if (publicRoute(method, path)) continue;

      const url = replaceParams(path);
      const httpMethod = method.toLowerCase();

      let req = (agent as any)[httpMethod](url);
      if (['post', 'patch', 'put'].includes(httpMethod)) {
        req = req.send({});
      }

      const res = await req;
      expect(res.status).toBe(401);
    }
  });
});


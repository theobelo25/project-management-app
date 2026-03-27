import { JwtService } from '@nestjs/jwt';
import { UserView } from '@repo/types';
import { AuthConfigService } from '@api/config';

import { AccessTokensService } from './access-tokens.service';
import { PinoLogger } from 'nestjs-pino';

describe('AccessTokensService', () => {
  let service: AccessTokensService;

  let authConfig: {
    access: {
      ttlMs: number;
      jwtSign: {
        secret: string;
        expiresIn: number;
        issuer: string;
        audience: string;
      };
    };
  };

  let jwtService: {
    sign: jest.Mock;
  };

  let logger: {
    setContext: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
    error: jest.Mock;
  };

  const fixedNow = new Date('2026-03-08T19:00:00.000Z');

  const user: UserView = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    orgId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    organizationName: 'Acme',
    email: 'test@example.com',
    name: 'Theo',
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);

    authConfig = {
      access: {
        ttlMs: 15 * 60 * 1000,
        jwtSign: {
          secret: 'test-secret',
          expiresIn: 900,
          issuer: 'test-issuer',
          audience: 'test-audience',
        },
      },
    };

    jwtService = {
      sign: jest.fn(),
    };

    logger = {
      setContext: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    };

    service = new AccessTokensService(
      authConfig as unknown as AuthConfigService,
      jwtService as unknown as JwtService,
      logger as unknown as PinoLogger,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('sign', () => {
    it('signs an access token with the correct payload and options', () => {
      jwtService.sign.mockReturnValue('signed-access-token');

      const result = service.sign(user);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: user.id,
          orgId: user.orgId,
        },
        authConfig.access.jwtSign,
      );

      expect(result).toEqual({
        accessToken: 'signed-access-token',
        accessTokenExpiresAt: new Date(
          fixedNow.getTime() + authConfig.access.ttlMs,
        ),
      });
    });

    it('only includes sub and orgId in the token payload', () => {
      jwtService.sign.mockReturnValue('signed-access-token');

      service.sign(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: user.id,
          orgId: user.orgId,
        },
        authConfig.access.jwtSign,
      );

      const payload = jwtService.sign.mock.calls[0][0];
      expect(payload).toEqual({ sub: user.id, orgId: user.orgId });
      expect(payload).not.toHaveProperty('email');
      expect(payload).not.toHaveProperty('name');
      expect(payload).not.toHaveProperty('createdAt');
      expect(payload).not.toHaveProperty('updatedAt');
    });

    it('returns the correct access token expiry time', () => {
      jwtService.sign.mockReturnValue('signed-access-token');

      const result = service.sign(user);

      expect(result.accessTokenExpiresAt).toEqual(
        new Date(fixedNow.getTime() + authConfig.access.ttlMs),
      );
    });
  });
});

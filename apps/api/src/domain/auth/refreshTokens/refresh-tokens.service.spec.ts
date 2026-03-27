import { UnauthorizedException } from '@nestjs/common';
import { AuthConfigService } from '@api/config';
import { RefreshTokensService } from './refresh-tokens.service';
import { PinoLogger } from 'nestjs-pino';

describe('RefreshTokensService', () => {
  let service: RefreshTokensService;

  let authConfig: {
    refresh: {
      ttlMs: number;
    };
  };

  let authRepository: {
    createRefreshToken: jest.Mock;
    findRefreshTokensByPrefix: jest.Mock;
    consumeAndReplaceRefreshToken: jest.Mock;
    revokeUserRefreshTokens: jest.Mock;
    revokeRefreshToken: jest.Mock;
  };

  let hashingService: {
    hash: jest.Mock;
    verify: jest.Mock;
  };

  let logger: {
    setContext: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
    error: jest.Mock;
  };

  const fixedNow = new Date('2026-03-08T19:30:00.000Z');
  const userId = '1415c2fc-4067-4c4f-a7e1-748afc4e9b71';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);

    authConfig = {
      refresh: {
        ttlMs: 7 * 24 * 60 * 60 * 1000,
      },
    };

    authRepository = {
      createRefreshToken: jest.fn(),
      findRefreshTokensByPrefix: jest.fn(),
      consumeAndReplaceRefreshToken: jest.fn(),
      revokeUserRefreshTokens: jest.fn(),
      revokeRefreshToken: jest.fn(),
      deleteExpiredRevokedRefreshTokens: jest.fn().mockResolvedValue(0),
    };

    hashingService = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    logger = {
      setContext: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    };

    service = new RefreshTokensService(
      authConfig as unknown as AuthConfigService,
      authRepository as any,
      hashingService as any,
      logger as unknown as PinoLogger,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('issueInitial', () => {
    it('creates an initial refresh token record and returns the raw token', async () => {
      hashingService.hash.mockResolvedValue('hashed-raw-token');
      authRepository.createRefreshToken.mockResolvedValue({
        id: 'rt-1',
        userId,
      });

      const rawToken = await service.issueInitial(userId);

      expect(typeof rawToken).toBe('string');
      expect(rawToken.length).toBeGreaterThan(0);

      expect(hashingService.hash).toHaveBeenCalledTimes(1);
      expect(hashingService.hash).toHaveBeenCalledWith(rawToken);

      expect(authRepository.createRefreshToken).toHaveBeenCalledTimes(1);
      expect(authRepository.createRefreshToken).toHaveBeenCalledWith(
        {
          userId,
          tokenHash: 'hashed-raw-token',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + authConfig.refresh.ttlMs),
        },
        undefined,
      );
    });
  });

  describe('rotate', () => {
    it('throws UnauthorizedException when the raw token does not match any token', async () => {
      authRepository.findRefreshTokensByPrefix.mockResolvedValue([]);

      await expect(service.rotate('raw-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate('raw-refresh-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('throws UnauthorizedException when the matched token is expired', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() - 1000),
          revokedAt: null,
          replacedByTokenId: null,
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      ]);

      hashingService.verify.mockResolvedValue(true);

      await expect(service.rotate(rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate(rawToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('revokes all user refresh tokens and throws when a revoked token is reused', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + 1000),
          revokedAt: fixedNow,
          replacedByTokenId: 'rt-2',
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      ]);

      hashingService.verify.mockResolvedValue(true);

      await expect(service.rotate(rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate(rawToken)).rejects.toThrow(
        'Refresh token reuse detected',
      );

      expect(authRepository.revokeUserRefreshTokens).toHaveBeenCalledWith(
        userId,
        fixedNow,
        undefined,
      );
    });

    it('revokes all user refresh tokens and throws when a replaced token is reused', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + 1000),
          revokedAt: null,
          replacedByTokenId: 'rt-2',
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      ]);

      hashingService.verify.mockResolvedValue(true);

      await expect(service.rotate(rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate(rawToken)).rejects.toThrow(
        'Refresh token reuse detected',
      );

      expect(authRepository.revokeUserRefreshTokens).toHaveBeenCalledWith(
        userId,
        fixedNow,
        undefined,
      );
    });

    it('successfully rotates a refresh token', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + 1000),
          revokedAt: null,
          replacedByTokenId: null,
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      ]);

      hashingService.verify.mockResolvedValue(true);
      hashingService.hash.mockResolvedValue('hashed-next-raw-token');

      authRepository.createRefreshToken.mockResolvedValue({
        id: 'rt-2',
        userId,
        tokenHash: 'hashed-next-raw-token',
        tokenPrefix: 'next-prefix',
        expiresAt: new Date(fixedNow.getTime() + authConfig.refresh.ttlMs),
        revokedAt: null,
        replacedByTokenId: null,
        createdAt: fixedNow,
        updatedAt: fixedNow,
      });

      authRepository.consumeAndReplaceRefreshToken.mockResolvedValue(true);

      const result = await service.rotate(rawToken);

      const nextRawToken = hashingService.hash.mock.calls[0][0];

      expect(hashingService.hash).toHaveBeenCalledWith(nextRawToken);

      expect(authRepository.createRefreshToken).toHaveBeenCalledWith(
        {
          userId,
          tokenHash: 'hashed-next-raw-token',
          tokenPrefix: nextRawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + authConfig.refresh.ttlMs),
        },
        undefined,
      );

      expect(authRepository.consumeAndReplaceRefreshToken).toHaveBeenCalledWith(
        {
          currentId: 'rt-1',
          replacedByTokenId: 'rt-2',
          now: fixedNow,
        },
        undefined,
      );

      expect(result).toEqual({
        userId,
        nextRawToken,
      });
    });

    it('revokes all user tokens and throws when consume-and-replace fails', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + 1000),
          revokedAt: null,
          replacedByTokenId: null,
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      ]);

      hashingService.verify.mockResolvedValue(true);
      hashingService.hash.mockResolvedValue('hashed-next-raw-token');

      authRepository.createRefreshToken.mockResolvedValue({
        id: 'rt-2',
        userId,
      });

      authRepository.consumeAndReplaceRefreshToken.mockResolvedValue(false);

      await expect(service.rotate(rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate(rawToken)).rejects.toThrow(
        'Refresh token reuse detected',
      );

      expect(authRepository.revokeUserRefreshTokens).toHaveBeenCalledWith(
        userId,
        fixedNow,
        undefined,
      );
    });
  });

  describe('revoke', () => {
    it('does nothing when no matching refresh token is found', async () => {
      authRepository.findRefreshTokensByPrefix.mockResolvedValue([]);

      await expect(
        service.revoke('raw-refresh-token'),
      ).resolves.toBeUndefined();

      expect(authRepository.revokeRefreshToken).not.toHaveBeenCalled();
    });

    it('does nothing when the matched refresh token is already revoked', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + 1000),
          revokedAt: fixedNow,
          replacedByTokenId: null,
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      ]);

      hashingService.verify.mockResolvedValue(true);

      await service.revoke(rawToken);

      expect(authRepository.revokeRefreshToken).not.toHaveBeenCalled();
    });

    it('revokes the matched refresh token', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
          tokenPrefix: rawToken.slice(0, 12),
          expiresAt: new Date(fixedNow.getTime() + 1000),
          revokedAt: null,
          replacedByTokenId: null,
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      ]);

      hashingService.verify.mockResolvedValue(true);

      await service.revoke(rawToken);

      expect(authRepository.revokeRefreshToken).toHaveBeenCalledWith(
        'rt-1',
        fixedNow,
      );
    });
  });
});

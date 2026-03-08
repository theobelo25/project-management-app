import { UnauthorizedException } from '@nestjs/common';
import { AuthConfigService } from '@api/config';
import { AUTH_REPOSITORY } from '../types/auth.tokens';
import { HASHING_SERVICE } from '../hashing/hashing.service.interface';
import { RefreshTokensService } from './refresh-tokens.service';

describe('RefreshTokensService', () => {
  let service: RefreshTokensService;

  let authConfig: {
    refresh: {
      ttlMs: number;
    };
  };

  let authRepository: {
    createRefreshToken: jest.Mock;
    findActiveRefreshTokensByPrefix: jest.Mock;
    findRefreshTokenById: jest.Mock;
    consumeAndReplaceRefreshToken: jest.Mock;
    revokeUserRefreshTokens: jest.Mock;
    revokeRefreshToken: jest.Mock;
  };

  let hashingService: {
    hash: jest.Mock;
    verify: jest.Mock;
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
      findActiveRefreshTokensByPrefix: jest.fn(),
      findRefreshTokenById: jest.fn(),
      consumeAndReplaceRefreshToken: jest.fn(),
      revokeUserRefreshTokens: jest.fn(),
      revokeRefreshToken: jest.fn(),
    };

    hashingService = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    service = new RefreshTokensService(
      authConfig as unknown as AuthConfigService,
      authRepository as any,
      hashingService as any,
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
    it('throws UnauthorizedException when the raw token does not match any active token', async () => {
      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([]);

      await expect(service.rotate('raw-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate('raw-refresh-token')).rejects.toThrow(
        'Invalid refresh token',
      );

      expect(authRepository.findRefreshTokenById).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when the matched token no longer exists', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
        },
      ]);
      hashingService.verify.mockResolvedValue(true);
      authRepository.findRefreshTokenById.mockResolvedValue(null);

      await expect(service.rotate(rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate(rawToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('throws UnauthorizedException when the matched token is expired', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
        },
      ]);
      hashingService.verify.mockResolvedValue(true);
      authRepository.findRefreshTokenById.mockResolvedValue({
        id: 'rt-1',
        userId,
        tokenHash: 'stored-hash',
        tokenPrefix: rawToken.slice(0, 12),
        expiresAt: new Date(fixedNow.getTime() - 1000),
        revokedAt: null,
        replacedById: null,
        createdAt: fixedNow,
        updatedAt: fixedNow,
      });

      await expect(service.rotate(rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.rotate(rawToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('revokes all user refresh tokens and throws when reuse is detected on an already revoked token', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
        },
      ]);
      hashingService.verify.mockResolvedValue(true);
      authRepository.findRefreshTokenById.mockResolvedValue({
        id: 'rt-1',
        userId,
        tokenHash: 'stored-hash',
        tokenPrefix: rawToken.slice(0, 12),
        expiresAt: new Date(fixedNow.getTime() + 1000),
        revokedAt: fixedNow,
        replacedById: 'rt-2',
        createdAt: fixedNow,
        updatedAt: fixedNow,
      });

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

      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
        },
      ]);
      hashingService.verify.mockResolvedValue(true);

      authRepository.findRefreshTokenById.mockResolvedValue({
        id: 'rt-1',
        userId,
        tokenHash: 'stored-hash',
        tokenPrefix: rawToken.slice(0, 12),
        expiresAt: new Date(fixedNow.getTime() + 1000),
        revokedAt: null,
        replacedById: null,
        createdAt: fixedNow,
        updatedAt: fixedNow,
      });

      hashingService.hash.mockResolvedValue('hashed-next-raw-token');

      authRepository.createRefreshToken.mockResolvedValue({
        id: 'rt-2',
        userId,
        tokenHash: 'hashed-next-raw-token',
        tokenPrefix: 'next-prefix',
        expiresAt: new Date(fixedNow.getTime() + authConfig.refresh.ttlMs),
        revokedAt: null,
        replacedById: null,
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
          replacedById: 'rt-2',
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

      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
        },
      ]);
      hashingService.verify.mockResolvedValue(true);

      authRepository.findRefreshTokenById.mockResolvedValue({
        id: 'rt-1',
        userId,
        tokenHash: 'stored-hash',
        tokenPrefix: rawToken.slice(0, 12),
        expiresAt: new Date(fixedNow.getTime() + 1000),
        revokedAt: null,
        replacedById: null,
        createdAt: fixedNow,
        updatedAt: fixedNow,
      });

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
      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([]);

      await expect(
        service.revoke('raw-refresh-token'),
      ).resolves.toBeUndefined();

      expect(authRepository.revokeRefreshToken).not.toHaveBeenCalled();
    });

    it('revokes the matched refresh token', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';

      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([
        {
          id: 'rt-1',
          userId,
          tokenHash: 'stored-hash',
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

  describe('findValidRefreshToken', () => {
    it('returns the matching refresh token record', async () => {
      const rawToken = 'abcdefghijklmnopqrstuvwx';
      const matchedRecord = {
        id: 'rt-1',
        userId,
        tokenHash: 'stored-hash',
      };

      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([
        matchedRecord,
      ]);
      hashingService.verify.mockResolvedValue(true);

      const result = await service.findValidRefreshToken(rawToken);

      expect(
        authRepository.findActiveRefreshTokensByPrefix,
      ).toHaveBeenCalledWith(rawToken.slice(0, 12), undefined);
      expect(hashingService.verify).toHaveBeenCalledWith(
        rawToken,
        matchedRecord.tokenHash,
      );
      expect(result).toEqual(matchedRecord);
    });

    it('returns null when no matching refresh token record is found', async () => {
      authRepository.findActiveRefreshTokensByPrefix.mockResolvedValue([]);

      const result = await service.findValidRefreshToken(
        'abcdefghijklmnopqrstuvwx',
      );

      expect(result).toBeNull();
    });
  });
});

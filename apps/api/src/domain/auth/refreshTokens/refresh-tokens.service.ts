import { AuthConfigService } from '@api/config';
import { Db } from '@api/prisma';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import {
  HASHING_SERVICE,
  HashingService,
} from '../hashing/hashing.service.interface';
import {
  CreateRefreshTokenInput,
  RefreshTokenRecord,
} from '../types/refresh-token.types';
import { AUTH_REPOSITORY } from '../types/auth.tokens';
import { AuthRepository } from '../repositories/auth.repository';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly authConfig: AuthConfigService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: HashingService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RefreshTokensService.name);
  }

  private generateRefreshToken(): string {
    return randomBytes(32).toString('base64url');
  }

  private getTokenPrefix(rawToken: string) {
    return rawToken.slice(0, 12);
  }

  private getRefreshExpiresAt() {
    return new Date(Date.now() + this.authConfig.refresh.ttlMs);
  }

  private async buildRefreshTokenRecord(userId: string): Promise<{
    rawToken: string;
    dto: CreateRefreshTokenInput;
  }> {
    const rawToken = this.generateRefreshToken();

    const dto: CreateRefreshTokenInput = {
      userId,
      tokenHash: await this.hashingService.hash(rawToken),
      tokenPrefix: this.getTokenPrefix(rawToken),
      expiresAt: this.getRefreshExpiresAt(),
    };

    return { rawToken, dto };
  }

  private async revokeAllAndThrowReuse(
    userId: string,
    now: Date,
    tx?: Db,
  ): Promise<never> {
    await this.authRepository.revokeUserRefreshTokens(userId, now, tx);
    this.logger.warn(
      { userId, revokedAt: now.toISOString() },
      'Refresh token reuse detected; revoked all active refresh tokens',
    );
    throw new UnauthorizedException('Refresh token reuse detected');
  }

  private async findByRaw(
    rawToken: string,
    tx?: Db,
  ): Promise<RefreshTokenRecord | null> {
    const tokenPrefix = this.getTokenPrefix(rawToken);

    const candidates =
      await this.authRepository.findActiveRefreshTokensByPrefix(
        tokenPrefix,
        tx,
      );

    for (const candidate of candidates) {
      const isMatch = await this.hashingService.verify(
        rawToken,
        candidate.tokenHash,
      );

      if (isMatch) {
        return candidate;
      }
    }

    return null;
  }

  async issueInitial(userId: string, tx?: Db): Promise<string> {
    const { rawToken, dto } = await this.buildRefreshTokenRecord(userId);

    const created = await this.authRepository.createRefreshToken(dto, tx);

    this.logger.info(
      { userId, tokenId: created.id },
      'Initial refresh token issued',
    );

    return rawToken;
  }

  async rotate(
    rawToken: string,
    tx?: Db,
  ): Promise<{ userId: string; nextRawToken: string }> {
    const matched = await this.findByRaw(rawToken, tx);

    if (!matched) {
      this.logger.warn('Invalid refresh token presented for rotation');
      throw new UnauthorizedException('Invalid refresh token');
    }

    const now = new Date();

    const current = await this.authRepository.findRefreshTokenById(
      matched.id,
      tx,
    );

    if (!current || current.expiresAt <= now) {
      this.logger.warn(
        {
          tokenId: matched.id,
          userId: matched.userId,
        },
        'Expired or missing refresh token presented for rotation',
      );
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (current.revokedAt) {
      return this.revokeAllAndThrowReuse(current.userId, now, tx);
    }

    const { rawToken: nextRawToken, dto } = await this.buildRefreshTokenRecord(
      current.userId,
    );

    const next = await this.authRepository.createRefreshToken(dto, tx);

    const consumed = await this.authRepository.consumeAndReplaceRefreshToken(
      {
        currentId: current.id,
        replacedById: next.id,
        now,
      },
      tx,
    );

    if (!consumed) {
      return this.revokeAllAndThrowReuse(current.userId, now, tx);
    }

    this.logger.info(
      {
        userId: current.userId,
        previousTokenId: current.id,
        nextTokenId: next.id,
      },
      'Refresh token rotated',
    );

    return {
      userId: current.userId,
      nextRawToken,
    };
  }

  async revoke(rawToken: string) {
    const matched = await this.findByRaw(rawToken);
    if (!matched) {
      this.logger.debug(
        'Refresh token revoke requested but no matching token was found',
      );
      return;
    }

    await this.authRepository.revokeRefreshToken(matched.id, new Date());
  }

  async findValidRefreshToken(
    rawRefreshToken: string,
    tx?: Db,
  ): Promise<RefreshTokenRecord | null> {
    return this.findByRaw(rawRefreshToken, tx);
  }
}

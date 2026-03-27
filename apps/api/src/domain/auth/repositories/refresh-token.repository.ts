import { Injectable } from '@nestjs/common';
import { Db } from '@api/prisma';
import { AuthRepository } from './auth.repository';
import {
  ConsumeAndReplaceRefreshTokenInput,
  CreateRefreshTokenInput,
  RefreshTokenRecord,
} from '../types/refresh-token.types';

@Injectable()
export class RefreshTokenRepositoryFacade {
  constructor(private readonly authRepository: AuthRepository) {}

  createRefreshToken(
    input: CreateRefreshTokenInput,
    tx?: Db,
  ): Promise<RefreshTokenRecord> {
    return this.authRepository.createRefreshToken(input, tx);
  }

  findRefreshTokensByPrefix(
    tokenPrefix: string,
    tx?: Db,
  ): Promise<RefreshTokenRecord[]> {
    return this.authRepository.findRefreshTokensByPrefix(tokenPrefix, tx);
  }

  consumeAndReplaceRefreshToken(
    input: ConsumeAndReplaceRefreshTokenInput,
    tx?: Db,
  ): Promise<boolean> {
    return this.authRepository.consumeAndReplaceRefreshToken(input, tx);
  }

  revokeUserRefreshTokens(userId: string, revokedAt: Date, tx?: Db) {
    return this.authRepository.revokeUserRefreshTokens(userId, revokedAt, tx);
  }

  revokeRefreshToken(id: string, revokedAt: Date, tx?: Db) {
    return this.authRepository.revokeRefreshToken(id, revokedAt, tx);
  }

  deleteExpiredRevokedRefreshTokens(now: Date, tx?: Db): Promise<number> {
    return this.authRepository.deleteExpiredRevokedRefreshTokens(now, tx);
  }
}

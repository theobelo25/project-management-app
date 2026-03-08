import { Db } from '@api/prisma';
import {
  ConsumeAndReplaceRefreshTokenInput,
  CreateRefreshTokenInput,
  RefreshTokenRecord,
} from '../types/refresh-token.types';

export abstract class AuthRepository {
  abstract createRefreshToken(
    input: CreateRefreshTokenInput,
    db?: Db,
  ): Promise<RefreshTokenRecord>;

  abstract findActiveRefreshTokensByPrefix(
    tokenPrefix: string,
    db?: Db,
  ): Promise<RefreshTokenRecord[]>;

  abstract findRefreshTokenById(
    id: string,
    db?: Db,
  ): Promise<RefreshTokenRecord | null>;

  abstract revokeRefreshToken(
    id: string,
    revokedAt: Date,
    db?: Db,
  ): Promise<void>;

  abstract revokeUserRefreshTokens(
    userId: string,
    revokedAt: Date,
    db?: Db,
  ): Promise<number>;

  abstract consumeAndReplaceRefreshToken(
    input: ConsumeAndReplaceRefreshTokenInput,
    db?: Db,
  ): Promise<boolean>;

  abstract deleteExpiredRevokedRefreshTokens(
    now: Date,
    db?: Db,
  ): Promise<number>;
}

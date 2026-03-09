import { Db } from '@api/prisma';
import {
  ConsumeAndReplaceRefreshTokenInput,
  CreateRefreshTokenInput,
  RefreshTokenRecord,
} from '../types/refresh-token.types';

export abstract class AuthRepository {
  abstract createRefreshToken(
    input: CreateRefreshTokenInput,
    tx?: Db,
  ): Promise<RefreshTokenRecord>;

  abstract findRefreshTokensByPrefix(
    tokenPrefix: string,
    tx?: Db,
  ): Promise<RefreshTokenRecord[]>;

  abstract findRefreshTokenById(
    id: string,
    tx?: Db,
  ): Promise<RefreshTokenRecord | null>;

  abstract revokeRefreshToken(
    id: string,
    revokedAt: Date,
    tx?: Db,
  ): Promise<void>;

  abstract revokeUserRefreshTokens(
    userId: string,
    revokedAt: Date,
    tx?: Db,
  ): Promise<number>;

  abstract consumeAndReplaceRefreshToken(
    input: ConsumeAndReplaceRefreshTokenInput,
    tx?: Db,
  ): Promise<boolean>;

  abstract deleteExpiredRevokedRefreshTokens(
    now: Date,
    tx?: Db,
  ): Promise<number>;
}

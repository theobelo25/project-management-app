import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { Db, PRISMA, PrismaClient } from '@api/prisma';
import {
  ConsumeAndReplaceRefreshTokenInput,
  CreateRefreshTokenInput,
  RefreshTokenRecord,
} from '../types/refresh-token.types';

@Injectable()
export class PrismaAuthRepository extends AuthRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  async createRefreshToken(
    input: CreateRefreshTokenInput,
    tx?: Db,
  ): Promise<RefreshTokenRecord> {
    const prisma = tx ?? this.prisma;

    const created = await prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        tokenPrefix: input.tokenPrefix,
        expiresAt: input.expiresAt,
      },
    });

    return this.toDomain(created);
  }

  async findActiveRefreshTokensByPrefix(
    tokenPrefix: string,
    tx?: Db,
  ): Promise<RefreshTokenRecord[]> {
    const prisma = tx ?? this.prisma;
    const now = new Date();

    const tokens = await prisma.refreshToken.findMany({
      where: {
        tokenPrefix,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tokens.map((token) => this.toDomain(token));
  }

  async findRefreshTokenById(
    id: string,
    tx?: Db,
  ): Promise<RefreshTokenRecord | null> {
    const prisma = tx ?? this.prisma;

    const token = await prisma.refreshToken.findUnique({ where: { id } });

    return token ? this.toDomain(token) : null;
  }

  async revokeRefreshToken(
    id: string,
    revokedAt: Date,
    tx?: Db,
  ): Promise<void> {
    const prisma = tx ?? this.prisma;

    await prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt,
      },
    });
  }

  async revokeUserRefreshTokens(
    userId: string,
    revokedAt: Date,
    tx?: Db,
  ): Promise<number> {
    const prisma = tx ?? this.prisma;

    const result = await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt,
      },
    });

    return result.count;
  }

  async consumeAndReplaceRefreshToken(
    input: ConsumeAndReplaceRefreshTokenInput,
    tx?: Db,
  ): Promise<boolean> {
    const prisma = tx ?? this.prisma;

    const result = await prisma.refreshToken.updateMany({
      where: {
        id: input.currentId,
        revokedAt: null,
        replacedByTokenId: null,
      },
      data: {
        revokedAt: input.now,
        replacedByTokenId: input.replacedById,
      },
    });

    return result.count === 1;
  }

  async deleteExpiredRevokedRefreshTokens(now: Date, tx?: Db): Promise<number> {
    const prisma = tx ?? this.prisma;

    const result = await prisma.refreshToken.deleteMany({
      where: {
        revokedAt: {
          not: null,
        },
        expiresAt: {
          lte: now,
        },
      },
    });

    return result.count;
  }

  private toDomain(token: {
    id: string;
    userId: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    revokedAt: Date | null;
    replacedByTokenId?: string | null;
  }): RefreshTokenRecord {
    return {
      id: token.id,
      userId: token.userId,
      tokenHash: token.tokenHash,
      tokenPrefix: token.tokenPrefix,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
      revokedAt: token.revokedAt,
      replacedByTokenId: token.replacedByTokenId ?? null,
    };
  }
}

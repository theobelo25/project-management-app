import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { PRISMA } from '@api/prisma';
import { PrismaClient } from '@repo/database';

@Injectable()
export class HealthService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly healthIndicator: HealthIndicatorService,
  ) {}

  async database(): Promise<HealthIndicatorResult> {
    const check = this.healthIndicator.check('database');
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return check.up();
    } catch {
      return check.down();
    }
  }
}

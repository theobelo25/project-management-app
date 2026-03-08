import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PRISMA } from '@api/prisma';
import { PrismaClient } from '@repo/database';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth(): Promise<{ status: string; db: 'ok' | 'error' }> {
    let db: 'ok' | 'error' = 'error';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = 'ok';
    } catch {
      // db stays 'error'
    }
    return { status: 'ok', db };
  }
}

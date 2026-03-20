import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PRISMA } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import { Public } from '@api/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
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

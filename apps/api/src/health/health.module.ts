import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '@api/prisma';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TerminusModule.forRoot(), PrismaModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}

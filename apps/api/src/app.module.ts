import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UsersModule } from './domain/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { validateEnv, AppConfigModule } from './config';
import { LoggerModule } from './logger/logger.module';
import { ProjectsModule } from './domain/projects/projects.module';
import { TasksModule } from './domain/tasks/tasks.module';
import { OrganizationsModule } from './domain/organizations/organizations.module';
import { NotificationsModule } from './domain/notifications/notifications.module';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@api/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env'],
    }),
    AppConfigModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    LoggerModule,
    ProjectsModule,
    TasksModule,
    OrganizationsModule,
    NotificationsModule,
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000,
        limit: 120,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppExceptionFilter,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

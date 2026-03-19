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
import { PROJECT_TASK_INFO_PROVIDER } from './domain/projects/types/project-task-info.types';
import { ProjectTaskInfoProviderAdapter } from './domain/tasks/adapters/project-task-info-provider.adapter';
import { TasksRepository } from './domain/tasks/repositories/tasks.repository';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppExceptionFilter,
    {
      provide: PROJECT_TASK_INFO_PROVIDER,
      useClass: ProjectTaskInfoProviderAdapter,
    },
  ],
})
export class AppModule {}

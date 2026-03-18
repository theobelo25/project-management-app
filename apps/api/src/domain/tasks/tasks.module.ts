import { Module } from '@nestjs/common';
import { PrismaTasksRepository } from './repositories/prisma-tasks.repository';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskAccessService } from './policies/task-access.service';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '@api/prisma';

@Module({
  imports: [ProjectsModule, UsersModule, NotificationsModule, PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskAccessService,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
  ],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}

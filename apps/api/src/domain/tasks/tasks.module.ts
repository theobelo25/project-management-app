import { Module } from '@nestjs/common';
import { PrismaTasksRepository } from './repositories/prisma-tasks.repository';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskAccessService } from './policies/task-access.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectsModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskAccessService,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}

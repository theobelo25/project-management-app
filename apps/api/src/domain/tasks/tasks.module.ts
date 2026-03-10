import { Module } from '@nestjs/common';
import { PrismaTasksRepository } from './repositories/prisma-tasks.repository';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}

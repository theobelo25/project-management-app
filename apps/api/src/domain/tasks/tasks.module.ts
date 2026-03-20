import { Module } from '@nestjs/common';
import {
  PrismaTasksRepository,
  PrismaTasksRepositoryTx,
} from './repositories/prisma-tasks.repository';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskAccessService } from './policies/task-access.service';
import { ProjectsPersistenceModule } from '../projects/projects-persistence.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '@api/prisma';
import { TASKS_REPOSITORY } from './tasks.tokens';
import { TASKS_REPOSITORY_TX_FACTORY } from './tasks.tx.tokens';
import { TaskAssignmentNotifier } from './notifiers/task-assignment-notifier';
import { TaskAssigneePolicy } from './policies/task-assignee-policy';
import { TaskAccessRules } from './policies/task-access.rules';
import { TaskAccessGuard } from './guards/task-access.guard';
import { TaskAccessContextLoader } from './policies/task-access-context.loader';
import { ProjectTaskInfoProviderAdapter } from './adapters/project-task-info-provider.adapter';
import { PROJECT_TASK_INFO_PROVIDER } from '../projects/types/project-task-info.types';
import type { Prisma } from '@repo/database';

@Module({
  imports: [
    ProjectsPersistenceModule,
    UsersModule,
    NotificationsModule,
    PrismaModule,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskAccessContextLoader,
    TaskAccessService,
    { provide: TaskAccessRules, useValue: new TaskAccessRules() },
    TaskAccessGuard,
    TaskAssignmentNotifier,
    TaskAssigneePolicy,
    ProjectTaskInfoProviderAdapter,
    {
      provide: PROJECT_TASK_INFO_PROVIDER,
      useExisting: ProjectTaskInfoProviderAdapter,
    },
    {
      provide: TASKS_REPOSITORY,
      useClass: PrismaTasksRepository,
    },
    {
      provide: TASKS_REPOSITORY_TX_FACTORY,
      useFactory:
        (): import('./repositories/tasks.repository').TasksRepositoryTxFactory =>
        (db) =>
          new PrismaTasksRepositoryTx(db),
    },
  ],
  /**
   * `TASKS_REPOSITORY` is intentionally NOT exported: it would let other modules bypass
   * `TasksService` + authorization rules. External modules should depend on
   * `PROJECT_TASK_INFO_PROVIDER` (read-only task projections) or call HTTP/use application services.
   */
  exports: [PROJECT_TASK_INFO_PROVIDER],
})
export class TasksModule {}

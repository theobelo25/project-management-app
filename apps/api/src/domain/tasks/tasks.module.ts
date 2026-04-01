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
import { TasksRepository } from './repositories/tasks.repository';
import { TASKS_REPOSITORY_TX_FACTORY } from './tasks.tx.tokens';
import { TaskAssignmentNotifier } from './notifiers/task-assignment-notifier';
import { TaskAssigneePolicy } from './policies/task-assignee-policy';
import { TaskAccessRules } from './policies/task-access.rules';
import { TaskAccessGuard } from './guards/task-access.guard';
import { TaskAccessContextLoader } from './policies/task-access-context.loader';
import { ProjectTaskInfoProviderAdapter } from './adapters/project-task-info-provider.adapter';
import { PROJECT_TASK_INFO_PROVIDER } from '../projects/types/project-task-info.types';
import { TaskDomainEventPublisher } from './events/task-domain-event.publisher';
import { TaskCreatedNotificationsHandler } from './handlers/task-created-notifications.handler';
import { TaskCreatedRealtimeHandler } from './handlers/task-created-realtime.handler';
import { TaskUpdatedNotificationsHandler } from './handlers/task-updated-notifications.handler';
import { TaskUpdatedRealtimeHandler } from './handlers/task-updated-realtime.handler';
import { TaskDeletedRealtimeHandler } from './handlers/task-deleted-realtime.handler';
import { TaskAssigneeAddedNotificationsHandler } from './handlers/task-assignee-added-notifications.handler';
import { TaskAssigneeAddedRealtimeHandler } from './handlers/task-assignee-added-realtime.handler';
import { TaskAssigneeRemovedRealtimeHandler } from './handlers/task-assignee-removed-realtime.handler';
import { LoggerModule } from '../../logger/logger.module';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { GetTaskByIdUseCase } from './use-cases/get-task-by-id.use-case';
import { FindTasksUseCase } from './use-cases/find-tasks.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';
import { AssignTaskUserUseCase } from './use-cases/assign-task-user.use-case';
import { UnassignTaskUserUseCase } from './use-cases/unassign-task-user.use-case';

@Module({
  imports: [
    LoggerModule,
    ProjectsPersistenceModule,
    UsersModule,
    NotificationsModule,
    PrismaModule,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    CreateTaskUseCase,
    UpdateTaskUseCase,
    GetTaskByIdUseCase,
    FindTasksUseCase,
    DeleteTaskUseCase,
    AssignTaskUserUseCase,
    UnassignTaskUserUseCase,
    TaskDomainEventPublisher,
    TaskCreatedNotificationsHandler,
    TaskCreatedRealtimeHandler,
    TaskUpdatedNotificationsHandler,
    TaskUpdatedRealtimeHandler,
    TaskDeletedRealtimeHandler,
    TaskAssigneeAddedNotificationsHandler,
    TaskAssigneeAddedRealtimeHandler,
    TaskAssigneeRemovedRealtimeHandler,
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
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
    {
      provide: TASKS_REPOSITORY_TX_FACTORY,
      useFactory:
        (): import('./repositories/tasks.repository').TasksRepositoryTxFactory =>
        (db) =>
          new PrismaTasksRepositoryTx(db as ConstructorParameters<
            typeof PrismaTasksRepositoryTx
          >[0]),
    },
  ],
  /**
   * `TasksRepository` is intentionally NOT exported: it would let other modules bypass
   * `TasksService` + authorization rules. External modules should depend on
   * `PROJECT_TASK_INFO_PROVIDER` (read-only task projections) or call HTTP/use application services.
   */
  exports: [PROJECT_TASK_INFO_PROVIDER],
})
export class TasksModule {}

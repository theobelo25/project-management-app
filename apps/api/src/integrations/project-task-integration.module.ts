import { Module } from '@nestjs/common';
import { PROJECT_TASK_INFO_PROVIDER } from '../domain/projects/types/project-task-info.types';
import { ProjectTaskInfoProviderAdapter } from '../domain/tasks/adapters/project-task-info-provider.adapter';
import { TasksModule } from '../domain/tasks/tasks.module';

@Module({
  imports: [TasksModule],
  providers: [
    ProjectTaskInfoProviderAdapter,
    {
      provide: PROJECT_TASK_INFO_PROVIDER,
      useExisting: ProjectTaskInfoProviderAdapter,
    },
  ],
  exports: [PROJECT_TASK_INFO_PROVIDER],
})
export class ProjectTaskIntegrationModule {}

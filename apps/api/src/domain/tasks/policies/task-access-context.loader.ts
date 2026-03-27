import { Inject, Injectable } from '@nestjs/common';
import type { ProjectWithRole } from '@api/domain/projects/types/projects.repository.types';
import {
  PROJECT_TASK_CONTEXT_REPOSITORY,
  type ProjectTaskContextRepository,
} from '@api/domain/projects/repositories/projects.repository';
import { TasksRepository } from '../repositories/tasks.repository';
import type { TaskAccessContext } from '../types/tasks.repository.types';

/**
 * Loads authorization-relevant context from persistence.
 * No policy decisions, no HTTP exceptions, no logging.
 */
@Injectable()
export class TaskAccessContextLoader {
  constructor(
    private readonly tasksRepository: TasksRepository,
    @Inject(PROJECT_TASK_CONTEXT_REPOSITORY)
    private readonly projectContext: ProjectTaskContextRepository,
  ) {}

  findProjectWithMemberRole(
    projectId: string,
    userId: string,
    orgId: string,
  ): Promise<ProjectWithRole | null> {
    return this.projectContext.findByIdWithMemberRole(projectId, userId, orgId);
  }

  findTaskAccessContext(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext | null> {
    return this.tasksRepository.findByIdWithAccessContext(taskId, userId);
  }
}

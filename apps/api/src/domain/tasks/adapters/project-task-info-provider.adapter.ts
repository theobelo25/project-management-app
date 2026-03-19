/**
 * Bridges the Tasks domain persistence to the Projects “read model” port (`IProjectTaskInfoProvider`).
 *
 * Registration / DI:
 * - Provided and exported as `PROJECT_TASK_INFO_PROVIDER` from `TasksModule`
 *   (see `tasks.module.ts`: `ProjectTaskInfoProviderAdapter` + `useExisting`).
 *
 * Previously this lived behind `integrations/project-task-integration.module.ts`; that extra module
 * is optional once `ProjectsModule` imports `TasksModule` and `TasksModule` exports the provider token.
 */
import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRecentTask } from '@repo/types';
import type { IProjectTaskInfoProvider } from '@api/domain/projects/types/project-task-info.types';
import { TasksRepository } from '../repositories/tasks.repository';
import { TASKS_REPOSITORY } from '../tasks.tokens';

@Injectable()
export class ProjectTaskInfoProviderAdapter implements IProjectTaskInfoProvider {
  constructor(
    @Inject(TASKS_REPOSITORY)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>> {
    return this.tasksRepository.getTaskCountsByProjectIds(projectIds, orgId);
  }

  async findRecentByProjectId(
    projectId: string,
    limit: number,
    orgId: string,
  ): Promise<ProjectRecentTask[]> {
    const tasks = await this.tasksRepository.findRecentByProjectId(
      projectId,
      limit,
      orgId,
    );

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    }));
  }
}

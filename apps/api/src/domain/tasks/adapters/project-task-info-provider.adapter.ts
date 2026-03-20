/**
 * Bridges the Tasks domain persistence to the Projects “read model” port (`IProjectTaskInfoProvider`).
 *
 * Registration / DI:
 * - Provided and exported as `PROJECT_TASK_INFO_PROVIDER` from `TasksModule`
 *   (see `tasks.module.ts`: `ProjectTaskInfoProviderAdapter` + `useExisting`).
 *
 * Task-side access to project membership for authorization uses `ProjectsPersistenceModule`
 * (`PROJECT_TASK_CONTEXT_REPOSITORY`), not `ProjectsModule`, avoiding a Projects ↔ Tasks module cycle.
 */
import { Injectable } from '@nestjs/common';
import type { ProjectRecentTask } from '@repo/types';
import type { IProjectTaskInfoProvider } from '@api/domain/projects/types/project-task-info.types';
import { TasksRepository } from '../repositories/tasks.repository';

@Injectable()
export class ProjectTaskInfoProviderAdapter implements IProjectTaskInfoProvider {
  constructor(private readonly tasksRepository: TasksRepository) {}

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

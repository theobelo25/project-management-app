import { Injectable } from '@nestjs/common';
import type { ProjectRecentTask } from '@repo/types';
import type { IProjectTaskInfoProvider } from '@api/domain/projects/types/project-task-info.types';
import { TasksRepository } from '../repositories/tasks.repository';

@Injectable()
export class ProjectTaskInfoProviderAdapter implements IProjectTaskInfoProvider {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTaskCountsByProjectIds(
    projectIds: string[],
  ): Promise<Map<string, { total: number; completed: number }>> {
    return this.tasksRepository.getTaskCountsByProjectIds(projectIds);
  }

  async findRecentByProjectId(
    projectId: string,
    limit: number,
  ): Promise<ProjectRecentTask[]> {
    const tasks = await this.tasksRepository.findRecentByProjectId(
      projectId,
      limit,
    );
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    }));
  }
}

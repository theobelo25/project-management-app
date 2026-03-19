import type { ProjectRecentTask } from '@repo/types';

export const PROJECT_TASK_INFO_PROVIDER = Symbol('PROJECT_TASK_INFO_PROVIDER');

export interface IProjectTaskInfoProvider {
  getTaskCountsByProjectIds(
    projectIds: string[],
  ): Promise<Map<string, { total: number; completed: number }>>;
  findRecentByProjectId(
    projectId: string,
    limit: number,
  ): Promise<ProjectRecentTask[]>;
}

import type { ProjectRecentTask } from '@repo/types';

export const PROJECT_TASK_INFO_PROVIDER = Symbol('PROJECT_TASK_INFO_PROVIDER');

export interface IProjectTaskInfoProvider {
  getTaskCountsByProjectIds(
    projectIds: string[],
    orgId: string,
  ): Promise<Map<string, { total: number; completed: number }>>;

  findRecentByProjectId(
    projectId: string,
    limit: number,
    orgId: string,
  ): Promise<ProjectRecentTask[]>;
}

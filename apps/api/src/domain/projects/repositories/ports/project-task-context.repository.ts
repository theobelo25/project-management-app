import { Db } from '@api/prisma';
import { ProjectWithRole } from '../../types/projects.repository.types';

export const PROJECT_TASK_CONTEXT_REPOSITORY = Symbol(
  'PROJECT_TASK_CONTEXT_REPOSITORY',
);

export interface ProjectTaskContextRepository {
  findByIdWithMemberRole(
    projectId: string,
    userId: string,
    orgId: string,
    db?: Db,
  ): Promise<ProjectWithRole | null>;
}

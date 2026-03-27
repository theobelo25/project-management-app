import { Db } from '@api/prisma';
import { Project } from '@repo/database';
import { ProjectWithRole } from '../../types/projects.repository.types';

export const PROJECT_AUTHORIZATION_REPOSITORY = Symbol(
  'PROJECT_AUTHORIZATION_REPOSITORY',
);

export interface ProjectAuthorizationRepository {
  findAuthorizedById(
    projectId: string,
    userId: string,
    orgId: string,
    db?: Db,
  ): Promise<ProjectWithRole | null>;

  findById(id: string, db?: Db): Promise<Project | null>;
}

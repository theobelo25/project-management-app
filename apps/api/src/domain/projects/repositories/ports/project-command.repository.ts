import { Db } from '@api/prisma';
import { Project } from '@repo/database';
import {
  CreateProjectWithOwnerInput,
  ProjectWithRole,
  UpdateProjectInput,
} from '../../types/projects.repository.types';

export const PROJECT_COMMAND_REPOSITORY = Symbol('PROJECT_COMMAND_REPOSITORY');

export interface ProjectCommandRepository {
  createWithOwner(
    input: CreateProjectWithOwnerInput,
    db?: Db,
  ): Promise<ProjectWithRole>;

  updateForUser(
    id: string,
    userId: string,
    data: UpdateProjectInput,
    db?: Db,
  ): Promise<ProjectWithRole>;

  archiveForUser(id: string, userId: string, db?: Db): Promise<ProjectWithRole>;

  unarchiveForUser(
    id: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole>;

  delete(id: string, db?: Db): Promise<Project>;
}

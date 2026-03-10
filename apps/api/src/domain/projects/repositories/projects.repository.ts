import { Db } from '@api/prisma';
import { Project, ProjectMember } from '@repo/database';
import {
  AddProjectMemberInput,
  CreateProjectWithOwnerInput,
  FindManyForUserInput,
  PaginatedProjectsResult,
  ProjectMemberWithUser,
  ProjectWithRole,
  UpdateProjectInput,
  UpdateProjectMemberRoleInput,
} from '../types/projects.repository.types';

export interface ProjectsRepository {
  createWithOwner(
    input: CreateProjectWithOwnerInput,
    db?: Db,
  ): Promise<ProjectWithRole>;

  findById(id: string, db?: Db): Promise<Project | null>;

  findManyForUser(
    input: FindManyForUserInput,
    db?: Db,
  ): Promise<PaginatedProjectsResult>;

  findAuthorizedById(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole | null>;

  findMembership(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectMember | null>;

  findMembersByProjectId(
    projectId: string,
    db?: Db,
  ): Promise<ProjectMemberWithUser[]>;

  addMember(
    input: AddProjectMemberInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser>;

  updateOwner(projectId: string, ownerId: string, db?: Db): Promise<void>;

  updateMemberRole(
    input: UpdateProjectMemberRoleInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser>;

  removeMember(projectId: string, userId: string, db?: Db): Promise<void>;

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

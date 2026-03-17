import { Db } from '@api/prisma';
import { Project, ProjectMember } from '@repo/database';
import {
  AddProjectMemberInput,
  CreateProjectWithOwnerInput,
  FindManyForUserInput,
  PaginatedProjectsResult,
  ProjectListMemberWithUser,
  ProjectMemberWithUser,
  ProjectWithRole,
  UpdateProjectInput,
  UpdateProjectMemberRoleInput,
} from '../types/projects.repository.types';

export abstract class ProjectsRepository {
  abstract createWithOwner(
    input: CreateProjectWithOwnerInput,
    db?: Db,
  ): Promise<ProjectWithRole>;

  abstract findById(id: string, db?: Db): Promise<Project | null>;

  abstract findManyForUser(
    input: FindManyForUserInput,
    db?: Db,
  ): Promise<PaginatedProjectsResult>;

  abstract findAuthorizedById(
    projectId: string,
    userId: string,
    orgId: string,
    db?: Db,
  ): Promise<ProjectWithRole | null>;

  abstract findByIdWithMemberRole(
    projectId: string,
    userId: string,
    orgId: string,
    db?: Db,
  ): Promise<ProjectWithRole | null>;

  abstract findMembership(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectMember | null>;

  abstract findMembersByProjectId(
    projectId: string,
    db?: Db,
  ): Promise<ProjectMemberWithUser[]>;

  abstract addMember(
    input: AddProjectMemberInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser>;

  abstract updateOwner(
    projectId: string,
    ownerId: string,
    db?: Db,
  ): Promise<void>;

  abstract updateMemberRole(
    input: UpdateProjectMemberRoleInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser>;

  abstract removeMember(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<void>;

  abstract updateForUser(
    id: string,
    userId: string,
    data: UpdateProjectInput,
    db?: Db,
  ): Promise<ProjectWithRole>;

  abstract archiveForUser(
    id: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole>;

  abstract unarchiveForUser(
    id: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole>;

  abstract delete(id: string, db?: Db): Promise<Project>;

  abstract findMembersWithUserByProjectIds(
    projectIds: string[],
    db?: Db,
  ): Promise<Map<string, ProjectListMemberWithUser[]>>;
}

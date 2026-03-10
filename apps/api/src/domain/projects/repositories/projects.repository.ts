import { Db } from '@api/prisma';
import { Prisma, Project, ProjectMember, ProjectRole } from '@repo/database';

export type ProjectWithRole = Project & {
  currentUserRole?: ProjectRole;
};

export type CreateProjectWithOwnerInput = {
  ownerId: string;
  name: string;
  description?: string;
};

export type FindManyForUserInput = {
  userId: string;
  page: number;
  pageSize: number;
  includeArchived: boolean;
};

export type PaginatedProjectsResult = {
  items: ProjectWithRole[];
  total: number;
  page: number;
  pageSize: number;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string | null;
};

export type ProjectMemberWithUser = {
  userId: string;
  role: ProjectRole;
  createdAt: Date;
};

export type AddProjectMemberInput = {
  projectId: string;
  userId: string;
  role: ProjectRole;
};

export type UpdateProjectMemberRoleInput = {
  projectId: string;
  userId: string;
  role: ProjectRole;
};

export type TransferProjectOwnershipInput = {
  projectId: string;
  currentOwnerId: string;
  nextOwnerId: string;
};

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

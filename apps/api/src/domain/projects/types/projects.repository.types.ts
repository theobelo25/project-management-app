import { Project, ProjectRole } from '@repo/database';
import type { ProjectsFilter, ProjectsSort } from '@repo/types';

export type ProjectWithRole = Project & {
  currentUserRole?: ProjectRole;
};

export type CreateProjectWithOwnerInput = {
  orgId: string;
  ownerId: string;
  name: string;
  description?: string;
};

export type FindManyForUserInput = {
  orgId: string;
  userId: string;
  page: number;
  pageSize: number;
  includeArchived: boolean;
  search?: string;
  filter: ProjectsFilter;
  sort: ProjectsSort;
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

export type ProjectListMemberWithUser = {
  userId: string;
  name: string;
  email?: string | null;
  image?: string | null;
};

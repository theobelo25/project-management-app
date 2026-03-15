import { Project, ProjectRole } from '@repo/database';

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
  search?: string;
  filter: 'all' | 'owned' | 'member' | 'archived';
  sort: 'updated-desc' | 'created-desc' | 'name-asc';
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

export type ProjectListMemberWithUser = {
  userId: string;
  name: string;
  email?: string | null;
  image?: string | null;
};

export type ProjectWithRoleAndCounts = ProjectWithRole & {
  totalTasks: number;
  completedTasks: number;
  openTasks: number;
  members: ProjectListMemberWithUser[];
};

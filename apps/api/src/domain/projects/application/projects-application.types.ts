import type { ProjectRole } from '@repo/database';

export interface CreateProjectCommand {
  name: string;
  description?: string;
}

export interface GetProjectsQueryCommand {
  page: number;
  pageSize: number;
  includeArchived: boolean;
  search?: string;
  filter: 'owned' | 'member' | 'all' | 'archived';
  sort: 'created-desc' | 'updated-desc' | 'name-asc';
}

export interface UpdateProjectCommand {
  name?: string;
  description?: string | null;
}

export interface AddProjectMemberCommand {
  userId: string;
  role: ProjectRole;
}

export interface UpdateProjectMemberRoleCommand {
  role: Exclude<ProjectRole, 'OWNER'>;
}

export interface TransferProjectOwnershipCommand {
  userId: string;
}

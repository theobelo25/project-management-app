import type {
  AddProjectMemberCommand,
  CreateProjectCommand,
  GetProjectsQueryCommand,
  TransferProjectOwnershipCommand,
  UpdateProjectCommand,
  UpdateProjectMemberRoleCommand,
} from './projects-application.types';
import type {
  AddProjectMemberDto,
  CreateProjectDto,
  GetProjectsQueryDto,
  TransferProjectOwnershipDto,
  UpdateProjectDto,
  UpdateProjectMemberRoleDto,
} from '../dto';

export function toCreateProjectCommand(
  dto: CreateProjectDto,
): CreateProjectCommand {
  return {
    name: dto.name,
    description: dto.description,
  };
}

export function toGetProjectsQueryCommand(
  dto: GetProjectsQueryDto,
): GetProjectsQueryCommand {
  return {
    page: dto.page,
    pageSize: dto.pageSize,
    includeArchived: dto.includeArchived ?? false,
    search: dto.search,
    filter: dto.filter ?? 'all',
    sort: dto.sort ?? 'updated-desc',
  };
}

export function toUpdateProjectCommand(
  dto: UpdateProjectDto,
): UpdateProjectCommand {
  return {
    name: dto.name,
    description: dto.description,
  };
}

export function toAddProjectMemberCommand(
  dto: AddProjectMemberDto,
): AddProjectMemberCommand {
  return {
    userId: dto.userId,
    role: dto.role,
  };
}

export function toUpdateProjectMemberRoleCommand(
  dto: UpdateProjectMemberRoleDto,
): UpdateProjectMemberRoleCommand {
  return {
    role: dto.role,
  };
}

export function toTransferProjectOwnershipCommand(
  dto: TransferProjectOwnershipDto,
): TransferProjectOwnershipCommand {
  return {
    userId: dto.userId,
  };
}

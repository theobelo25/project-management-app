import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AuthUser,
  AddProjectMemberDto,
  CreateProjectDto,
  GetProjectsQueryDto,
  PaginatedProjectsListView,
  ProjectDetailView,
  ProjectMembersView,
  ProjectMemberView,
  ProjectView,
  TransferProjectOwnershipDto,
  UpdateProjectMemberRoleDto,
  UpdateProjectDto,
} from '@repo/types';
import { ProjectWithRole } from './types/projects.repository.types';

import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectOwnershipService } from './services/project-ownership.service';

@Injectable()
export class ProjectsFacade {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectMembersService: ProjectMembersService,
    private readonly projectOwnershipService: ProjectOwnershipService,
    // Optional: only if you want façade-level logging/metrics
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectsFacade.name);
  }

  async create(user: AuthUser, dto: CreateProjectDto): Promise<ProjectView> {
    return this.projectsService.create(user, dto);
  }

  async findManyForUser(
    user: AuthUser,
    query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsListView> {
    return this.projectsService.findManyForUser(user, query);
  }

  async findByIdDetail(
    projectId: string,
    user: AuthUser,
  ): Promise<ProjectDetailView> {
    return this.projectsService.findDetailById(projectId, user);
  }

  async update(
    projectId: string,
    user: AuthUser,
    dto: UpdateProjectDto,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsService.update(projectId, user, dto, authorizedProject);
  }

  async archive(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsService.archive(projectId, user, authorizedProject);
  }

  async unarchive(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsService.unarchive(projectId, user, authorizedProject);
  }

  async getMembers(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectMembersView> {
    return this.projectMembersService.getMembers(
      projectId,
      user,
      authorizedProject,
    );
  }

  async addMember(
    projectId: string,
    actor: AuthUser,
    dto: AddProjectMemberDto,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    return this.projectMembersService.addMember(
      projectId,
      actor,
      dto,
      authorizedProject,
    );
  }

  async updateMemberRole(
    projectId: string,
    actor: AuthUser,
    memberUserId: string,
    dto: UpdateProjectMemberRoleDto,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    return this.projectMembersService.updateMemberRole(
      projectId,
      actor,
      memberUserId,
      dto,
      authorizedProject,
    );
  }

  async removeMember(
    projectId: string,
    actor: AuthUser,
    memberUserId: string,
    authorizedProject?: ProjectWithRole,
  ): Promise<void> {
    return this.projectMembersService.removeMember(
      projectId,
      actor,
      memberUserId,
      authorizedProject,
    );
  }

  async transferOwnership(
    projectId: string,
    actor: AuthUser,
    dto: TransferProjectOwnershipDto,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectOwnershipService.transferOwnership(
      projectId,
      actor,
      dto,
      authorizedProject,
    );
  }

  async delete(
    projectId: string,
    actor: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<void> {
    return this.projectsService.delete(projectId, actor, authorizedProject);
  }
}

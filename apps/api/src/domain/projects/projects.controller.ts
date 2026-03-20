import { CurrentUser } from '@api/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  AuthUser,
  PaginatedProjectsListView,
  ProjectMembersView,
  ProjectMemberView,
  ProjectView,
} from '@repo/types';
import {
  CreateProjectDto,
  GetProjectsQueryDto,
  ProjectIdParamDto,
  UpdateProjectDto,
  TransferProjectOwnershipDto,
  ProjectMemberParamDto,
  UpdateProjectMemberRoleDto,
  AddProjectMemberDto,
} from './dto';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectOwnershipService } from './services/project-ownership.service';
import { RequireProjectRole } from './decorators/require-project-role.decorator';
import { ProjectRole } from '@repo/database';
import { ProjectRoleGuard } from './guards/project-role.guard';
import { CurrentProject } from './decorators/current-project.decorator';
import { ProjectWithRole } from './types/projects.repository.types';
import { ProjectsFacade } from './projects.facade';

@Controller('projects')
@UseGuards(ProjectRoleGuard)
export class ProjectsController {
  constructor(private readonly projectsFacade: ProjectsFacade) {}

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateProjectDto,
  ): Promise<ProjectView> {
    return this.projectsFacade.create(user, body);
  }

  @Get()
  async findMany(
    @CurrentUser() user: AuthUser,
    @Query() query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsListView> {
    return this.projectsFacade.findManyForUser(user, query);
  }

  @Get(':id')
  async findById(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectView> {
    return this.projectsFacade.findByIdDetail(params.id, user);
  }

  @Patch(':id')
  @RequireProjectRole(ProjectRole.ADMIN)
  async update(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: UpdateProjectDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsFacade.update(params.id, user, body, project);
  }

  @Patch(':id/archive')
  @RequireProjectRole(ProjectRole.OWNER)
  async archive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsFacade.archive(params.id, user, project);
  }

  @Patch(':id/unarchive')
  @RequireProjectRole(ProjectRole.OWNER)
  async unarchive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsFacade.unarchive(params.id, user, project);
  }

  @Get(':id/members')
  @RequireProjectRole(ProjectRole.MEMBER)
  async getMembers(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @CurrentProject() project: ProjectWithRole,
  ): Promise<ProjectMembersView> {
    return this.projectsFacade.getMembers(params.id, user, project);
  }

  @Post(':id/members')
  @RequireProjectRole(ProjectRole.OWNER)
  async addMember(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: AddProjectMemberDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    return this.projectsFacade.addMember(params.id, user, body, project);
  }

  @Patch(':id/members/:userId')
  @RequireProjectRole(ProjectRole.OWNER)
  async updateMemberRole(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectMemberParamDto,
    @Body() body: UpdateProjectMemberRoleDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    return this.projectsFacade.updateMemberRole(
      params.id,
      user,
      params.userId,
      body,
      project,
    );
  }

  @Delete(':id/members/:userId')
  @RequireProjectRole(ProjectRole.OWNER)
  @HttpCode(204)
  async removeMember(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectMemberParamDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<void> {
    return this.projectsFacade.removeMember(
      params.id,
      user,
      params.userId,
      project,
    );
  }

  @Patch(':id/owner')
  @RequireProjectRole(ProjectRole.OWNER)
  async transferOwnership(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: TransferProjectOwnershipDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsFacade.transferOwnership(
      params.id,
      user,
      body,
      project,
    );
  }

  @Delete(':id')
  @RequireProjectRole(ProjectRole.OWNER)
  @HttpCode(204)
  async delete(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<void> {
    return this.projectsFacade.delete(params.id, user, project);
  }
}

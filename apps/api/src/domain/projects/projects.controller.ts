import { CurrentUser, JwtAuthGuard } from '@api/common';
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
import { ProjectMembersService } from './members/project-members.service';
import { ProjectOwnershipService } from './members/project-ownership.service';
import { RequireProjectRole } from './decorators/require-project-role.decorator';
import { ProjectRole } from '@repo/database';
import { ProjectRoleGuard } from './guards/project-role.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectMembersService: ProjectMembersService,
    private readonly projectOwnershipService: ProjectOwnershipService,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateProjectDto,
  ): Promise<ProjectView> {
    return this.projectsService.create(user, body);
  }

  @Get()
  async findMany(
    @CurrentUser() user: AuthUser,
    @Query() query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsListView> {
    return this.projectsService.findManyForUser(user, query);
  }

  @Get(':id')
  async findById(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectView> {
    return this.projectsService.findDetailById(params.id, user);
  }

  @Patch(':id')
  @RequireProjectRole(ProjectRole.ADMIN)
  async update(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: UpdateProjectDto,
  ): Promise<ProjectView> {
    return this.projectsService.update(params.id, user, body);
  }

  @Patch(':id/archive')
  @RequireProjectRole(ProjectRole.OWNER)
  async archive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectView> {
    return this.projectsService.archive(params.id, user);
  }

  @Patch(':id/unarchive')
  @RequireProjectRole(ProjectRole.OWNER)
  async unarchive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectView> {
    return this.projectsService.unarchive(params.id, user);
  }

  @Get(':id/members')
  async getMembers(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectMembersView> {
    return this.projectMembersService.getMembers(params.id, user);
  }

  @Post(':id/members')
  @RequireProjectRole(ProjectRole.OWNER)
  async addMember(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: AddProjectMemberDto,
  ): Promise<ProjectMemberView> {
    return this.projectMembersService.addMember(params.id, user, body);
  }

  @Patch(':id/members/:userId')
  @RequireProjectRole(ProjectRole.OWNER)
  async updateMemberRole(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectMemberParamDto,
    @Body() body: UpdateProjectMemberRoleDto,
  ): Promise<ProjectMemberView> {
    return this.projectMembersService.updateMemberRole(
      params.id,
      user,
      params.userId,
      body,
    );
  }

  @Delete(':id/members/:userId')
  @RequireProjectRole(ProjectRole.OWNER)
  @HttpCode(204)
  async removeMember(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectMemberParamDto,
  ): Promise<void> {
    return this.projectMembersService.removeMember(
      params.id,
      user,
      params.userId,
    );
  }

  @Patch(':id/owner')
  @RequireProjectRole(ProjectRole.OWNER)
  async transferOwnership(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: TransferProjectOwnershipDto,
  ): Promise<ProjectView> {
    return this.projectOwnershipService.transferOwnership(
      params.id,
      user,
      body,
    );
  }

  @Delete(':id')
  @RequireProjectRole(ProjectRole.OWNER)
  @HttpCode(204)
  async delete(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<void> {
    return this.projectsService.delete(params.id, user);
  }
}

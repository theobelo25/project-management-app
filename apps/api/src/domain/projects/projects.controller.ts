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
  PaginatedProjectsView,
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

@Controller('projects')
@UseGuards(JwtAuthGuard)
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
    return this.projectsService.create(user.id, body);
  }

  @Get()
  async findMany(
    @CurrentUser() user: AuthUser,
    @Query() query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsView> {
    return this.projectsService.findManyForUser(user.id, query);
  }

  @Get(':id')
  async findById(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectView> {
    return this.projectsService.findById(params.id, user.id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: UpdateProjectDto,
  ): Promise<ProjectView> {
    return this.projectsService.update(params.id, user.id, body);
  }

  @Patch(':id/archive')
  async archive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectView> {
    return this.projectsService.archive(params.id, user.id);
  }

  @Patch(':id/unarchive')
  async unarchive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectView> {
    return this.projectsService.unarchive(params.id, user.id);
  }

  @Get(':id/members')
  async getMembers(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectMembersView> {
    return this.projectMembersService.getMembers(params.id, user.id);
  }

  @Post(':id/members')
  async addMember(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: AddProjectMemberDto,
  ): Promise<ProjectMemberView> {
    return this.projectMembersService.addMember(params.id, user.id, body);
  }

  @Patch(':id/members/:userId')
  async updateMemberRole(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectMemberParamDto,
    @Body() body: UpdateProjectMemberRoleDto,
  ): Promise<ProjectMemberView> {
    return this.projectMembersService.updateMemberRole(
      params.id,
      user.id,
      params.userId,
      body,
    );
  }

  @Delete(':id/members/:userId')
  @HttpCode(204)
  async removeMember(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectMemberParamDto,
  ): Promise<void> {
    return this.projectMembersService.removeMember(
      params.id,
      user.id,
      params.userId,
    );
  }

  @Patch(':id/owner')
  async transferOwnership(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: TransferProjectOwnershipDto,
  ): Promise<ProjectView> {
    return this.projectOwnershipService.transferOwnership(
      params.id,
      user.id,
      body,
    );
  }
}

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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  AuthUser,
  PaginatedProjectsListView,
  ProjectDetailView,
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
import { RequireProjectRole } from './decorators/require-project-role.decorator';
import { ProjectRole } from '@repo/database';
import { ProjectRoleGuard } from './guards/project-role.guard';
import { CurrentProject } from './decorators/current-project.decorator';
import { ProjectWithRole } from './types/projects.repository.types';
import { ProjectsApplicationService } from './projects.facade';
import {
  toAddProjectMemberCommand,
  toCreateProjectCommand,
  toGetProjectsQueryCommand,
  toTransferProjectOwnershipCommand,
  toUpdateProjectCommand,
  toUpdateProjectMemberRoleCommand,
} from './application/projects-http.mapper';
import {
  PaginatedProjectsListResponseDto,
  ProjectDetailViewResponseDto,
  ProjectMemberResponseDto,
  ProjectMembersResponseDto,
  ProjectViewResponseDto,
} from '@api/common/swagger/response-dtos';

@Controller('projects')
@ApiTags('projects')
@ApiCookieAuth('Authentication')
@UseGuards(ProjectRoleGuard)
export class ProjectsController {
  constructor(
    private readonly projectsApplicationService: ProjectsApplicationService,
  ) {}

  @Post()
  @ZodSerializerDto(ProjectViewResponseDto)
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateProjectDto,
  ): Promise<ProjectView> {
    // ensure runtime serialization + OpenAPI response schema stay aligned
    return this.projectsApplicationService.create(user, toCreateProjectCommand(body));
  }

  @Get()
  @ZodSerializerDto(PaginatedProjectsListResponseDto)
  async findMany(
    @CurrentUser() user: AuthUser,
    @Query() query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsListView> {
    return this.projectsApplicationService.findManyForUser(
      user,
      toGetProjectsQueryCommand(query),
    );
  }

  @Get(':id')
  @ZodSerializerDto(ProjectDetailViewResponseDto)
  async findById(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
  ): Promise<ProjectDetailView> {
    return this.projectsApplicationService.findByIdDetail(params.id, user);
  }

  @Patch(':id')
  @RequireProjectRole(ProjectRole.ADMIN)
  @ZodSerializerDto(ProjectViewResponseDto)
  async update(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: UpdateProjectDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsApplicationService.update(
      params.id,
      user,
      toUpdateProjectCommand(body),
      project,
    );
  }

  @Patch(':id/archive')
  @RequireProjectRole(ProjectRole.OWNER)
  @ZodSerializerDto(ProjectViewResponseDto)
  async archive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsApplicationService.archive(params.id, user, project);
  }

  @Patch(':id/unarchive')
  @RequireProjectRole(ProjectRole.OWNER)
  @ZodSerializerDto(ProjectViewResponseDto)
  async unarchive(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsApplicationService.unarchive(params.id, user, project);
  }

  @Get(':id/members')
  @ZodSerializerDto(ProjectMembersResponseDto)
  async getMembers(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @CurrentProject() project: ProjectWithRole,
  ): Promise<ProjectMembersView> {
    return this.projectsApplicationService.getMembers(params.id, user, project);
  }

  @Post(':id/members')
  @RequireProjectRole(ProjectRole.OWNER)
  @ZodSerializerDto(ProjectMemberResponseDto)
  async addMember(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: AddProjectMemberDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    return this.projectsApplicationService.addMember(
      params.id,
      user,
      toAddProjectMemberCommand(body),
      project,
    );
  }

  @Patch(':id/members/:userId')
  @RequireProjectRole(ProjectRole.OWNER)
  @ZodSerializerDto(ProjectMemberResponseDto)
  async updateMemberRole(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectMemberParamDto,
    @Body() body: UpdateProjectMemberRoleDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    return this.projectsApplicationService.updateMemberRole(
      params.id,
      user,
      params.userId,
      toUpdateProjectMemberRoleCommand(body),
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
    return this.projectsApplicationService.removeMember(
      params.id,
      user,
      params.userId,
      project,
    );
  }

  @Patch(':id/owner')
  @RequireProjectRole(ProjectRole.OWNER)
  @ZodSerializerDto(ProjectViewResponseDto)
  async transferOwnership(
    @CurrentUser() user: AuthUser,
    @Param() params: ProjectIdParamDto,
    @Body() body: TransferProjectOwnershipDto,
    @CurrentProject() project?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.projectsApplicationService.transferOwnership(
      params.id,
      user,
      toTransferProjectOwnershipCommand(body),
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
    return this.projectsApplicationService.delete(params.id, user, project);
  }
}

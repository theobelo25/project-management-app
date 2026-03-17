import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProjectWithOwnerInput } from './types/projects.repository.types';
import {
  AuthUser,
  CreateProjectDto,
  GetProjectsQueryDto,
  PaginatedProjectsListView,
  ProjectDetailView,
  ProjectView,
  UpdateProjectDto,
} from '@repo/types';
import {
  toPaginatedProjectListView,
  toProjectDetailView,
  toProjectView,
} from './mappers/project.mapper';
import { ProjectAccessService } from './policies/project-access.service';
import { ProjectRole } from '@repo/database';
import { ProjectsRepository } from './repositories/projects.repository';
import { PinoLogger } from 'nestjs-pino';
import { TasksRepository } from '../tasks/repositories/tasks.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectAccessService: ProjectAccessService,
    private readonly logger: PinoLogger,
    private readonly taskRepository: TasksRepository,
  ) {
    this.logger.setContext(ProjectsService.name);
  }

  async create(user: AuthUser, dto: CreateProjectDto): Promise<ProjectView> {
    const input: CreateProjectWithOwnerInput = {
      orgId: user.orgId,
      ownerId: user.id,
      name: dto.name,
      description: dto.description,
    };

    const project = await this.projectsRepository.createWithOwner(input);

    this.logger.info(
      { event: 'project.created', ownerId: user.id, projectId: project.id },
      'Project created successfully',
    );

    return toProjectView(project);
  }

  async findManyForUser(
    user: AuthUser,
    query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsListView> {
    const result = await this.projectsRepository.findManyForUser({
      orgId: user.orgId,
      userId: user.id,
      page: query.page,
      pageSize: query.pageSize,
      includeArchived: query.includeArchived,
      search: query.search,
      filter: query.filter,
      sort: query.sort,
    });

    const projectIds = result.items.map((p) => p.id);
    const taskCountsMap =
      await this.taskRepository.getTaskCountsByProjectIds(projectIds);
    const membersMap =
      await this.projectsRepository.findMembersWithUserByProjectIds(projectIds);

    return toPaginatedProjectListView(result, taskCountsMap, membersMap);
  }

  async findById(projectId: string, user: AuthUser): Promise<ProjectView> {
    const project = await this.projectAccessService.requireMember(
      projectId,
      user,
    );

    return toProjectView(project);
  }

  async update(
    projectId: string,
    user: AuthUser,
    dto: UpdateProjectDto,
  ): Promise<ProjectView> {
    const project = await this.projectAccessService.requireRole(
      projectId,
      user,
      ProjectRole.ADMIN,
    );

    if (project.archivedAt)
      throw new ForbiddenException('Archived projects cannot be modified');

    const updatedProject = await this.projectsRepository.updateForUser(
      projectId,
      user.id,
      {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
      },
    );

    this.logger.info(
      { event: 'project.updated', userId: user.id, projectId },
      'Project updated successfully',
    );

    return toProjectView(updatedProject);
  }

  async archive(projectId: string, user: AuthUser): Promise<ProjectView> {
    const project = await this.projectAccessService.requireOwner(
      projectId,
      user,
    );

    if (project.archivedAt)
      throw new ForbiddenException('Project is already archived');

    const archivedProject = await this.projectsRepository.archiveForUser(
      projectId,
      user.id,
    );

    this.logger.info(
      { event: 'project.archived', userId: user.id, projectId },
      'Project archived successfully',
    );

    return toProjectView(archivedProject);
  }

  async unarchive(projectId: string, user: AuthUser): Promise<ProjectView> {
    const project = await this.projectAccessService.requireOwner(
      projectId,
      user,
    );

    if (!project.archivedAt)
      throw new ForbiddenException('Project is not archived');

    const unarchivedProject = await this.projectsRepository.unarchiveForUser(
      projectId,
      user.id,
    );

    this.logger.info(
      { event: 'project.unarchived', userId: user.id, projectId },
      'Project unarchived successfully',
    );

    return toProjectView(unarchivedProject);
  }

  async findDetailById(
    projectId: string,
    user: AuthUser,
  ): Promise<ProjectDetailView> {
    const project = await this.projectAccessService.requireMember(
      projectId,
      user,
    );

    const [countsMap, members, recentTasks] = await Promise.all([
      this.taskRepository.getTaskCountsByProjectIds([projectId]),
      this.projectsRepository.findMembersWithUserByProjectIds([projectId]),
      this.taskRepository.findRecentByProjectId(projectId, 10),
    ]);

    const counts = countsMap.get(projectId) ?? { total: 0, completed: 0 };
    const membersList = members.get(projectId) ?? [];

    return toProjectDetailView(project, counts, membersList, recentTasks);
  }

  async delete(projectId: string, user: AuthUser): Promise<void> {
    await this.projectAccessService.requireOwner(projectId, user);
    await this.projectsRepository.delete(projectId);

    this.logger.info(
      { event: 'project.deleted', userId: user.id, projectId },
      'Project deleted successfully',
    );
  }
}

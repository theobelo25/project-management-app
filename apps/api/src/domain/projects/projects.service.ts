import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateProjectWithOwnerInput } from './types/projects.repository.types';
import {
  CreateProjectDto,
  GetProjectsQueryDto,
  PaginatedProjectsListView,
  PaginatedProjectsView,
  ProjectView,
  UpdateProjectDto,
} from '@repo/types';
import {
  toPaginatedProjectListView,
  toPaginatedProjectsView,
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

  async create(ownerId: string, dto: CreateProjectDto): Promise<ProjectView> {
    const input: CreateProjectWithOwnerInput = {
      ownerId,
      name: dto.name,
      description: dto.description,
    };

    const project = await this.projectsRepository.createWithOwner(input);

    this.logger.info(
      { event: 'project.created', ownerId, projectId: project.id },
      'Project created successfully',
    );

    return toProjectView(project);
  }

  async findManyForUser(
    userId: string,
    query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsListView> {
    const result = await this.projectsRepository.findManyForUser({
      userId,
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

  async findById(projectId: string, userId: string): Promise<ProjectView> {
    const project = await this.projectAccessService.requireMember(
      projectId,
      userId,
    );

    return toProjectView(project);
  }

  async update(
    projectId: string,
    userId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectView> {
    const project = await this.projectAccessService.requireRole(
      projectId,
      userId,
      ProjectRole.ADMIN,
    );

    if (project.archivedAt)
      throw new ForbiddenException('Archived projects cannot be modified');

    const updatedProject = await this.projectsRepository.updateForUser(
      projectId,
      userId,
      {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
      },
    );

    this.logger.info(
      { event: 'project.updated', userId, projectId },
      'Project updated successfully',
    );

    return toProjectView(updatedProject);
  }

  async archive(projectId: string, userId: string): Promise<ProjectView> {
    const project = await this.projectAccessService.requireOwner(
      projectId,
      userId,
    );

    if (project.archivedAt)
      throw new ForbiddenException('Project is already archived');

    const archivedProject = await this.projectsRepository.archiveForUser(
      projectId,
      userId,
    );

    this.logger.info(
      { event: 'project.archived', userId, projectId },
      'Project archived successfully',
    );

    return toProjectView(archivedProject);
  }

  async unarchive(projectId: string, userId: string): Promise<ProjectView> {
    const project = await this.projectAccessService.requireOwner(
      projectId,
      userId,
    );

    if (!project.archivedAt)
      throw new ForbiddenException('Project is not archived');

    const unarchivedProject = await this.projectsRepository.unarchiveForUser(
      projectId,
      userId,
    );

    this.logger.info(
      { event: 'project.unarchived', userId, projectId },
      'Project unarchived successfully',
    );

    return toProjectView(unarchivedProject);
  }
}

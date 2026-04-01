import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AuthUser,
  PaginatedProjectsListView,
  ProjectDetailView,
  ProjectView,
} from '@repo/types';
import { ProjectWithRole } from './types/projects.repository.types';
import { ProjectsCommandsService, ProjectsQueriesService } from './services';
import type {
  CreateProjectCommand,
  GetProjectsQueryCommand,
  UpdateProjectCommand,
} from './application/projects-application.types';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly commands: ProjectsCommandsService,
    private readonly queries: ProjectsQueriesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectsService.name);
  }

  async create(
    user: AuthUser,
    command: CreateProjectCommand,
  ): Promise<ProjectView> {
    return this.commands.create(user, command);
  }

  async findManyForUser(
    user: AuthUser,
    query: GetProjectsQueryCommand,
  ): Promise<PaginatedProjectsListView> {
    return this.queries.findManyForUser(user, query);
  }

  async findById(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.queries.findById(projectId, user, authorizedProject);
  }

  async update(
    projectId: string,
    user: AuthUser,
    command: UpdateProjectCommand,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.commands.update(projectId, user, command, authorizedProject);
  }

  async archive(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.commands.archive(projectId, user, authorizedProject);
  }

  async unarchive(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.commands.unarchive(projectId, user, authorizedProject);
  }

  async findDetailById(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectDetailView> {
    return this.queries.findDetailById(projectId, user, authorizedProject);
  }

  async delete(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<void> {
    return this.commands.delete(projectId, user, authorizedProject);
  }
}

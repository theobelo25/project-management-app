import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProjectRole } from '@repo/database';
import { AuthUser, ProjectView } from '@repo/types';
import {
  PROJECT_COMMAND_REPOSITORY,
  type ProjectCommandRepository,
} from '../repositories/projects.repository';
import { ProjectAccessService } from '../policies/project-access.service';
import { toProjectView } from '../mappers/project.mapper';
import {
  CreateProjectWithOwnerInput,
  ProjectWithRole,
} from '../types/projects.repository.types';
import type {
  CreateProjectCommand,
  UpdateProjectCommand,
} from '../application/projects-application.types';

@Injectable()
export class ProjectsCommandsService {
  constructor(
    @Inject(PROJECT_COMMAND_REPOSITORY)
    private readonly projects: ProjectCommandRepository,
    private readonly projectAccessService: ProjectAccessService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectsCommandsService.name);
  }

  async create(
    user: AuthUser,
    command: CreateProjectCommand,
  ): Promise<ProjectView> {
    const input: CreateProjectWithOwnerInput = {
      orgId: user.orgId,
      ownerId: user.id,
      name: command.name,
      description: command.description,
    };

    const project = await this.projects.createWithOwner(input);

    this.logger.info(
      { event: 'project.created', ownerId: user.id, projectId: project.id },
      'Project created successfully',
    );

    return toProjectView(project);
  }

  async update(
    projectId: string,
    user: AuthUser,
    command: UpdateProjectCommand,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    if (authorizedProject) {
      this.projectAccessService.assertRoleAtLeast(
        authorizedProject,
        ProjectRole.ADMIN,
      );
      this.projectAccessService.assertNotArchived(
        authorizedProject,
        'Archived projects cannot be modified',
      );
    } else {
      await this.projectAccessService.requireRoleAndNotArchived(
        projectId,
        user,
        ProjectRole.ADMIN,
      );
    }

    const updatedProject = await this.projects.updateForUser(
      projectId,
      user.id,
      {
        ...(command.name !== undefined ? { name: command.name } : {}),
        ...(command.description !== undefined
          ? { description: command.description }
          : {}),
      },
    );

    this.logger.info(
      { event: 'project.updated', userId: user.id, projectId },
      'Project updated successfully',
    );

    return toProjectView(updatedProject);
  }

  async archive(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    if (authorizedProject) {
      this.projectAccessService.assertOwner(authorizedProject);
      this.projectAccessService.assertNotArchived(
        authorizedProject,
        'Project is already archived',
      );
    } else {
      await this.projectAccessService.requireOwnerAndUnarchived(
        projectId,
        user,
      );
    }

    const archivedProject = await this.projects.archiveForUser(
      projectId,
      user.id,
    );

    this.logger.info(
      { event: 'project.archived', userId: user.id, projectId },
      'Project archived successfully',
    );

    return toProjectView(archivedProject);
  }

  async unarchive(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    if (authorizedProject) {
      this.projectAccessService.assertOwner(authorizedProject);
      this.projectAccessService.assertArchived(
        authorizedProject,
        'Project is not archived',
      );
    } else {
      await this.projectAccessService.requireOwnerAndArchived(projectId, user);
    }

    const unarchivedProject = await this.projects.unarchiveForUser(
      projectId,
      user.id,
    );

    this.logger.info(
      { event: 'project.unarchived', userId: user.id, projectId },
      'Project unarchived successfully',
    );

    return toProjectView(unarchivedProject);
  }

  async delete(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<void> {
    if (authorizedProject) {
      this.projectAccessService.assertOwner(authorizedProject);
    } else {
      await this.projectAccessService.requireOwner(projectId, user);
    }

    await this.projects.delete(projectId);

    this.logger.info(
      { event: 'project.deleted', userId: user.id, projectId },
      'Project deleted successfully',
    );
  }
}

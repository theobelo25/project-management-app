import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProjectRole } from '@repo/database';
import {
  AuthUser,
  CreateProjectDto,
  ProjectView,
  UpdateProjectDto,
} from '@repo/types';
import { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectAccessService } from '../policies/project-access.service';
import { toProjectView } from '../mappers/project.mapper';
import {
  CreateProjectWithOwnerInput,
  ProjectWithRole,
} from '../types/projects.repository.types';

@Injectable()
export class ProjectsCommandsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectAccessService: ProjectAccessService,
    private readonly logger: PinoLogger,
  ) {}

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

  async update(
    projectId: string,
    user: AuthUser,
    dto: UpdateProjectDto,
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

    await this.projectsRepository.delete(projectId);

    this.logger.info(
      { event: 'project.deleted', userId: user.id, projectId },
      'Project deleted successfully',
    );
  }
}

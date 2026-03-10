import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROJECTS_REPOSITORY } from '../types/projects.tokens';
import { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectRole } from '@repo/database';
import { Db } from '@api/prisma';
import { ProjectWithRole } from '../types/projects.repository.types';

@Injectable()
export class ProjectAccessService {
  constructor(
    @Inject(PROJECTS_REPOSITORY)
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  private roleRank(role: ProjectRole): number {
    switch (role) {
      case ProjectRole.OWNER:
        return 3;
      case ProjectRole.ADMIN:
        return 2;
      case ProjectRole.MEMBER:
        return 1;
      default:
        return 0;
    }
  }

  async getAuthorizedProject(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.projectsRepository.findAuthorizedById(
      projectId,
      userId,
      db,
    );

    if (project) return project;

    const existingProject = await this.projectsRepository.findById(
      projectId,
      db,
    );
    if (!existingProject) throw new NotFoundException('Project not found');

    throw new ForbiddenException('You do not have access to this project');
  }

  async getUserRole(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectRole | null> {
    const project = await this.getAuthorizedProject(projectId, userId, db);
    return project.currentUserRole ?? null;
  }

  async requireMember(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole> {
    return this.getAuthorizedProject(projectId, userId, db);
  }

  async requireRole(
    projectId: string,
    userId: string,
    minimumRole: ProjectRole,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.getAuthorizedProject(projectId, userId, db);
    const role = project.currentUserRole;

    if (!role)
      throw new ForbiddenException('You do not have access to this project');

    if (this.roleRank(role) < this.roleRank(minimumRole))
      throw new ForbiddenException('Insufficient project permissions');

    return project;
  }

  async requireOwner(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.getAuthorizedProject(projectId, userId, db);

    if (project.currentUserRole !== ProjectRole.OWNER) {
      throw new ForbiddenException(
        'Only the project owner can perform this action',
      );
    }

    return project;
  }
}

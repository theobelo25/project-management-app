import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectRole } from '@repo/database';
import { Db } from '@api/prisma';
import { ProjectWithRole } from '../types/projects.repository.types';
import { AuthUser } from '@repo/types';

@Injectable()
export class ProjectAccessService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

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
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.projectsRepository.findAuthorizedById(
      projectId,
      user.id,
      user.orgId,
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
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectRole | null> {
    const project = await this.getAuthorizedProject(projectId, user, db);
    return project.currentUserRole ?? null;
  }

  async requireMember(
    projectId: string,
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    return this.getAuthorizedProject(projectId, user, db);
  }

  async requireRole(
    projectId: string,
    user: AuthUser,
    minimumRole: ProjectRole,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.getAuthorizedProject(projectId, user, db);
    const role = project.currentUserRole;

    if (!role)
      throw new ForbiddenException('You do not have access to this project');

    if (this.roleRank(role) < this.roleRank(minimumRole))
      throw new ForbiddenException('Insufficient project permissions');

    return project;
  }

  async requireOwner(
    projectId: string,
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.getAuthorizedProject(projectId, user, db);

    if (project.currentUserRole !== ProjectRole.OWNER) {
      throw new ForbiddenException(
        'Only the project owner can perform this action',
      );
    }

    return project;
  }
}

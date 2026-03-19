import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PROJECT_AUTHORIZATION_REPOSITORY,
  type ProjectAuthorizationRepository,
} from '../repositories/projects.repository';
import { ProjectRole } from '@repo/database';
import { Db } from '@api/prisma';
import { ProjectWithRole } from '../types/projects.repository.types';
import { AuthUser } from '@repo/types';

@Injectable()
export class ProjectAccessService {
  constructor(
    @Inject(PROJECT_AUTHORIZATION_REPOSITORY)
    private readonly projects: ProjectAuthorizationRepository,
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
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.projects.findAuthorizedById(
      projectId,
      user.id,
      user.orgId,
      db,
    );

    if (project) return project;

    const existingProject = await this.projects.findById(projectId, db);
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
    this.assertRoleAtLeast(project, minimumRole);
    return project;
  }

  async requireOwner(
    projectId: string,
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.getAuthorizedProject(projectId, user, db);
    this.assertOwner(project);
    return project;
  }

  async requireNotArchived(
    projectId: string,
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.getAuthorizedProject(projectId, user, db);
    this.assertNotArchived(project, 'Archived projects cannot be modified');
    return project;
  }

  async requireRoleAndNotArchived(
    projectId: string,
    user: AuthUser,
    minimumRole: ProjectRole,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.requireRole(projectId, user, minimumRole, db);
    this.assertNotArchived(project, 'Archived projects cannot be modified');
    return project;
  }

  async requireOwnerAndNotArchived(
    projectId: string,
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.requireOwner(projectId, user, db);
    this.assertNotArchived(
      project,
      'Archived projects cannot modify membership',
    );
    return project;
  }

  async requireOwnerAndUnarchived(
    projectId: string,
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.requireOwner(projectId, user, db);
    this.assertNotArchived(project, 'Project is already archived');
    return project;
  }

  async requireOwnerAndArchived(
    projectId: string,
    user: AuthUser,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const project = await this.requireOwner(projectId, user, db);
    this.assertArchived(project, 'Project is not archived');
    return project;
  }

  assertRoleAtLeast(project: ProjectWithRole, minimumRole: ProjectRole) {
    const role = project.currentUserRole;

    if (!role) {
      throw new ForbiddenException('You do not have access to this project');
    }

    if (this.roleRank(role) < this.roleRank(minimumRole)) {
      throw new ForbiddenException('Insufficient project permissions');
    }
  }

  assertOwner(project: ProjectWithRole) {
    if (project.currentUserRole !== ProjectRole.OWNER) {
      throw new ForbiddenException(
        'Only the project owner can perform this action',
      );
    }
  }

  assertNotArchived(project: ProjectWithRole, message: string) {
    if (project.archivedAt) {
      throw new ForbiddenException(message);
    }
  }

  assertArchived(project: ProjectWithRole, message: string) {
    if (!project.archivedAt) {
      throw new ForbiddenException(message);
    }
  }
}

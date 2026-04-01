import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PROJECT_AUTHORIZATION_REPOSITORY,
  PROJECT_MEMBER_REPOSITORY,
  type ProjectAuthorizationRepository,
  type ProjectMemberRepository,
} from '../repositories/projects.repository';
import {
  AuthUser,
  ProjectView,
} from '@repo/types';
import { ProjectAccessService } from '../policies/project-access.service';
import { UNIT_OF_WORK } from '@api/prisma';
import { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';
import { ProjectRole } from '@repo/database';
import { toProjectView } from '../mappers/project.mapper';
import { PinoLogger } from 'nestjs-pino';
import { ProjectWithRole } from '../types/projects.repository.types';
import type { TransferProjectOwnershipCommand } from '../application/projects-application.types';

@Injectable()
export class ProjectOwnershipService {
  constructor(
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly members: ProjectMemberRepository,
    @Inject(PROJECT_AUTHORIZATION_REPOSITORY)
    private readonly authProjects: ProjectAuthorizationRepository,
    private readonly projectAccessService: ProjectAccessService,
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWork,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectOwnershipService.name);
  }

  async transferOwnership(
    projectId: string,
    actor: AuthUser,
    command: TransferProjectOwnershipCommand,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    return this.uow.transaction(async (db) => {
      if (authorizedProject) {
        this.projectAccessService.assertOwner(authorizedProject);
        this.projectAccessService.assertNotArchived(
          authorizedProject,
          'Archived projects cannot transfer ownership',
        );
      } else {
        await this.projectAccessService.requireOwnerAndNotArchived(
          projectId,
          actor,
          db,
        );
      }

      if (command.userId === actor.id) {
        throw new ConflictException('User is already the project owner');
      }

      const targetMembership = await this.members.findMembership(
        projectId,
        command.userId,
        db,
      );

      if (!targetMembership) {
        throw new NotFoundException('Target user is not a project member');
      }

      await this.members.updateOwner(projectId, command.userId, db);

      await this.members.updateMemberRole(
        {
          projectId,
          userId: command.userId,
          role: ProjectRole.OWNER,
        },
        db,
      );

      await this.members.updateMemberRole(
        {
          projectId,
          userId: actor.id,
          role: ProjectRole.ADMIN,
        },
        db,
      );

      const updatedProject = await this.authProjects.findAuthorizedById(
        projectId,
        command.userId,
        actor.orgId,
        db,
      );

      if (!updatedProject) {
        throw new NotFoundException('Project not found');
      }

      this.logger.info(
        {
          event: 'project.owner.transferred',
          projectId,
          previousOwnerId: actor.id,
          newOwnerId: command.userId,
        },
        'Project ownership transferred successfully',
      );

      return toProjectView(updatedProject);
    });
  }
}

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectView, TransferProjectOwnershipDto } from '@repo/types';
import { ProjectAccessService } from '../policies/project-access.service';
import { UNIT_OF_WORK } from '@api/prisma';
import { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';
import { ProjectRole } from '@repo/database';
import { toProjectView } from '../mappers/project.mapper';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProjectOwnershipService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectAccessService: ProjectAccessService,
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWork,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectOwnershipService.name);
  }

  async transferOwnership(
    projectId: string,
    actorUserId: string,
    dto: TransferProjectOwnershipDto,
  ): Promise<ProjectView> {
    return this.uow.transaction(async (db) => {
      await this.projectAccessService.requireOwner(projectId, actorUserId, db);

      if (dto.userId === actorUserId) {
        throw new ConflictException('User is already the project owner');
      }

      this.logger.info(
        { projectId, actorUserId, targetUserId: dto.userId },
        'Initiating project ownership transfer',
      );

      const targetMembership = await this.projectsRepository.findMembership(
        projectId,
        dto.userId,
        db,
      );

      if (!targetMembership) {
        throw new NotFoundException('Target user is not a project member');
      }

      await this.projectsRepository.updateOwner(projectId, dto.userId, db);

      await this.projectsRepository.updateMemberRole(
        {
          projectId,
          userId: dto.userId,
          role: ProjectRole.OWNER,
        },
        db,
      );

      await this.projectsRepository.updateMemberRole(
        {
          projectId,
          userId: actorUserId,
          role: ProjectRole.ADMIN,
        },
        db,
      );

      const updatedProject = await this.projectsRepository.findAuthorizedById(
        projectId,
        dto.userId,
        db,
      );

      if (!updatedProject) {
        throw new NotFoundException('Project not found');
      }

      this.logger.info(
        {
          event: 'project.owner.transfered',
          projectId,
          previousOwnerId: actorUserId,
          newOwnerId: dto.userId,
        },
        'Project ownership transferred successfully',
      );

      return toProjectView(updatedProject);
    });
  }
}

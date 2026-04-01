import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UNIT_OF_WORK } from '@api/prisma';
import { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';
import { PinoLogger } from 'nestjs-pino';

import { OrganizationsRepository } from '../repositories/organizations.repository';
import { OrganizationMembershipsRepository } from '../repositories/organization-memberships.repository';
import { UsersService } from '../../users/users.service';

import { OrganizationErrorMessages } from '../constants/error-messages';
import { OWNER_ROLE } from '../constants/organization-roles';

@Injectable()
export class OrganizationsDomainService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWork,

    private readonly organizationsRepository: OrganizationsRepository,
    private readonly organizationMembershipsRepository: OrganizationMembershipsRepository,
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(OrganizationsDomainService.name);
  }

  async createOrganization(userId: string, name: string) {
    const organizationName = name.trim();
    if (!organizationName) {
      throw new BadRequestException(
        OrganizationErrorMessages.ORGANIZATION_NAME_REQUIRED,
      );
    }

    return this.uow.transaction(async (db) => {
      const organization = await this.organizationsRepository.create(
        { name: organizationName },
        db,
      );

      await this.organizationMembershipsRepository.addMembershipIfMissing(
        userId,
        organization.id,
        OWNER_ROLE,
        db,
      );

      await this.usersService.updateUserOrganizationIds(
        userId,
        {
          activeOrganizationId: organization.id,
          defaultOrganizationId: organization.id,
        },
        db,
      );

      this.logger.info(
        {
          event: 'organization.created',
          userId,
          organizationId: organization.id,
        },
        'Organization created successfully',
      );

      return organization;
    });
  }

  async leaveOrganization(
    userId: string,
    organizationId: string,
  ): Promise<void> {
    return this.uow.transaction(async (db) => {
      const user = await this.usersService.findUserOrganizationIds(userId, db);

      if (!user) {
        throw new NotFoundException(OrganizationErrorMessages.USER_NOT_FOUND);
      }

      const membershipRole =
        await this.organizationMembershipsRepository.findMembershipRole(
          userId,
          organizationId,
          db,
        );

      if (!membershipRole) {
        throw new ForbiddenException(OrganizationErrorMessages.NOT_MEMBER);
      }

      if (membershipRole === OWNER_ROLE) {
        const anotherOwnerExists =
          await this.organizationMembershipsRepository.findAnotherOwner(
            organizationId,
            userId,
            db,
          );

        if (!anotherOwnerExists) {
          throw new BadRequestException(
            OrganizationErrorMessages.LAST_OWNER_CANNOT_LEAVE,
          );
        }
      }

      const isActiveOrganization = user.activeOrganizationId === organizationId;

      if (isActiveOrganization) {
        const fallbackOrganizationId =
          await this.organizationMembershipsRepository.findReassignmentOrganizationId(
            userId,
            organizationId,
            user.defaultOrganizationId,
            db,
          );

        if (!fallbackOrganizationId) {
          throw new BadRequestException(
            OrganizationErrorMessages.MUST_HAVE_OTHER_ORG_TO_LEAVE,
          );
        }

        const updateData: {
          activeOrganizationId: string;
          defaultOrganizationId?: string;
        } = { activeOrganizationId: fallbackOrganizationId };

        if (user.defaultOrganizationId === organizationId) {
          updateData.defaultOrganizationId = fallbackOrganizationId;
        }

        await this.usersService.updateUserOrganizationIds(
          userId,
          updateData,
          db,
        );
      }

      await this.organizationMembershipsRepository.removeMembership(
        userId,
        organizationId,
        db,
      );

      this.logger.info(
        {
          event: 'organization.left',
          userId,
          organizationId,
          activeOrgChanged: isActiveOrganization,
        },
        'Organization left successfully',
      );
    });
  }

  async deleteOrganization(
    userId: string,
    organizationId: string,
  ): Promise<void> {
    return this.uow.transaction(async (db) => {
      const membershipRole =
        await this.organizationMembershipsRepository.findMembershipRole(
          userId,
          organizationId,
          db,
        );

      if (!membershipRole) {
        throw new ForbiddenException(OrganizationErrorMessages.NOT_MEMBER);
      }

      if (membershipRole !== OWNER_ROLE) {
        throw new ForbiddenException(
          OrganizationErrorMessages.ONLY_OWNERS_CAN_DELETE,
        );
      }

      const activeUsers =
        await this.usersService.getUsersWithActiveOrganization(
          organizationId,
          db,
        );

      const reassignmentResults =
        await this.organizationMembershipsRepository.findReassignmentOrganizationIdsForUsers(
          activeUsers.map((u) => ({
            userId: u.id,
            preferredOrganizationId: u.defaultOrganizationId,
          })),
          organizationId,
          db,
        );

      const reassignmentNull = reassignmentResults.find(
        (r) => !r.reassignmentOrganizationId,
      );

      if (reassignmentNull) {
        throw new BadRequestException(
          OrganizationErrorMessages.CANNOT_DELETE_MEMBERS_NO_OTHER_ORG,
        );
      }

      const activeDefaultByUserId = new Map(
        activeUsers.map((u) => [u.id, u.defaultOrganizationId]),
      );

      const updates = reassignmentResults.map((r) => {
        const reassignmentOrganizationId =
          r.reassignmentOrganizationId as string;

        const shouldUpdateDefault =
          activeDefaultByUserId.get(r.userId) === organizationId;

        return {
          userId: r.userId,
          activeOrganizationId: reassignmentOrganizationId,
          ...(shouldUpdateDefault
            ? { defaultOrganizationId: reassignmentOrganizationId }
            : {}),
        };
      });

      await this.usersService.updateUsersOrganizationIds(updates, db);
      await this.organizationsRepository.delete(organizationId, db);

      this.logger.info(
        {
          event: 'organization.deleted',
          userId,
          organizationId,
          reassignedUsers: updates.length,
        },
        'Organization deleted successfully',
      );
    });
  }
}

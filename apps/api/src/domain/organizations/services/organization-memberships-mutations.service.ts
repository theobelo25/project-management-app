import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Db, UNIT_OF_WORK } from '@api/prisma';
import type { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';
import { Prisma } from '@repo/database';
import { OrganizationMemberView, OrganizationRole } from '@repo/types';

import { OrganizationMembershipsAuthorizationService } from './organization-memberships-authorization.service';
import { OrganizationErrorMessages } from '../constants/error-messages';
import { DEFAULT_MEMBER_ROLE } from '../constants/organization-roles';
import { OrganizationMembershipsRepository } from '../repositories/organization-memberships.repository';
import { runInTx } from '../utils/run-in-tx.util';
import {
  canAddMembers,
  canChangeMemberRoles,
  canRemoveMembers,
} from '../policies/organization-permissions.policy';

@Injectable()
export class OrganizationMembershipsMutationsService {
  constructor(
    private readonly repository: OrganizationMembershipsRepository,
    private readonly authorization: OrganizationMembershipsAuthorizationService,
    @Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork,
  ) {}

  async setActiveOrganization(userId: string, organizationId: string, db?: Db) {
    return runInTx(this.uow, db, async (tx) => {
      const orgExists = await this.repository.organizationExists(
        organizationId,
        tx,
      );

      if (!orgExists) {
        throw new NotFoundException(
          OrganizationErrorMessages.ORGANIZATION_NOT_FOUND,
        );
      }

      await this.authorization.assertMembership(userId, organizationId, tx);
      await this.repository.setActiveOrganization(userId, organizationId, tx);
    });
  }

  async addMembershipIfMissing(
    userId: string,
    organizationId: string,
    role: OrganizationRole = DEFAULT_MEMBER_ROLE,
    db?: Db,
  ) {
    return runInTx(this.uow, db, async (tx) => {
      await this.repository.addMembershipIfMissing(
        userId,
        organizationId,
        role,
        tx,
      );
    });
  }

  async addMember(
    actorUserId: string,
    organizationId: string,
    memberUserId: string,
    db?: Db,
  ): Promise<OrganizationMemberView> {
    return runInTx(this.uow, db, async (tx) => {
      const actorMembership = await this.authorization.assertMembership(
        actorUserId,
        organizationId,
        tx,
      );

      if (!canAddMembers(actorMembership.role)) {
        throw new ForbiddenException(
          OrganizationErrorMessages.ONLY_OWNERS_ADMINS_ADD_MEMBERS,
        );
      }

      try {
        const membership = await this.repository.addMemberMembership(
          organizationId,
          memberUserId,
          DEFAULT_MEMBER_ROLE,
          tx,
        );

        if (!membership) {
          throw new NotFoundException(OrganizationErrorMessages.USER_NOT_FOUND);
        }

        return membership;
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          throw new ConflictException(
            OrganizationErrorMessages.USER_ALREADY_MEMBER,
          );
        }
        throw err;
      }
    });
  }

  async removeMember(
    actorUserId: string,
    organizationId: string,
    memberUserId: string,
    db?: Db,
  ): Promise<void> {
    return runInTx(this.uow, db, async (tx) => {
      const actorMembership = await this.authorization.assertMembership(
        actorUserId,
        organizationId,
        tx,
      );

      if (!canRemoveMembers(actorMembership.role)) {
        throw new ForbiddenException(
          OrganizationErrorMessages.ONLY_OWNERS_ADMINS_ADD_MEMBERS,
        );
      }

      const targetRole = await this.repository.findMembershipRole(
        memberUserId,
        organizationId,
        tx,
      );

      if (!targetRole) {
        throw new NotFoundException(OrganizationErrorMessages.NOT_MEMBER);
      }

      if (targetRole === 'OWNER') {
        const ownerCount = await this.repository.countOwners(
          organizationId,
          tx,
        );
        if (ownerCount <= 1) {
          throw new BadRequestException(
            OrganizationErrorMessages.LAST_OWNER_CANNOT_LEAVE,
          );
        }
      }

      await this.repository.removeMember(organizationId, memberUserId, tx);
    });
  }

  async updateMemberRole(
    actorUserId: string,
    organizationId: string,
    memberUserId: string,
    role: OrganizationRole,
    db?: Db,
  ): Promise<void> {
    return runInTx(this.uow, db, async (tx) => {
      const actorMembership = await this.authorization.assertMembership(
        actorUserId,
        organizationId,
        tx,
      );

      if (!canChangeMemberRoles(actorMembership.role)) {
        throw new ForbiddenException(
          OrganizationErrorMessages.ONLY_OWNERS_ADMINS_ADD_MEMBERS,
        );
      }

      const currentRole = await this.repository.findMembershipRole(
        memberUserId,
        organizationId,
        tx,
      );

      if (!currentRole) {
        throw new NotFoundException(OrganizationErrorMessages.NOT_MEMBER);
      }

      // Prevent demoting the last owner
      if (currentRole === 'OWNER' && role !== 'OWNER') {
        const ownerCount = await this.repository.countOwners(
          organizationId,
          tx,
        );
        if (ownerCount <= 1) {
          throw new BadRequestException(
            OrganizationErrorMessages.LAST_OWNER_CANNOT_LEAVE,
          );
        }
      }

      await this.repository.updateMemberRole(
        organizationId,
        memberUserId,
        role,
        tx,
      );
    });
  }
}

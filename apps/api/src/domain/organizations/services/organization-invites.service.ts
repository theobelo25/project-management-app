import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  AuthUser,
  OrganizationInviteAdminView,
  OrganizationInviteView,
  OrganizationRole,
  PendingInviteView,
} from '@repo/types';
import { Db, UNIT_OF_WORK } from '@api/prisma';
import type { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';

import { OrganizationInvitesRepository } from '../repositories/organization-invites.repository';
import { OrganizationMembershipsService } from './organization-memberships.service';
import { UsersRepository } from '../../users/repositories/users.repository';

import {
  generateInviteToken,
  inviteTokenHash,
  inviteTokenPrefix,
} from '../utils/invite-token.util';

import { PinoLogger } from 'nestjs-pino';
import { DEFAULT_MEMBER_ROLE } from '../constants/organization-roles';
import { OrganizationErrorMessages } from '../constants/error-messages';
import { InviteUrlService } from './invite-url.service';
import { runInTx } from '../utils/run-in-tx.util';
import {
  canCreateInvites,
  canRevokeInvites,
} from '../policies/organization-permissions.policy';

const INVITE_EXPIRY_DAYS = 7;

function normalizeEmail(email: string | undefined | null): string {
  return (email ?? '').trim().toLowerCase();
}

@Injectable()
export class OrganizationInvitesService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWork,

    private readonly invitesRepository: OrganizationInvitesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly organizationMembershipsService: OrganizationMembershipsService,
    private readonly inviteUrlService: InviteUrlService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(OrganizationInvitesService.name);
  }

  private async getActorRoleInOrg(
    actor: AuthUser,
    db?: Db,
  ): Promise<OrganizationRole> {
    const { role } = await this.organizationMembershipsService.assertMembership(
      actor.id,
      actor.orgId,
      db,
    );
    return role;
  }

  private assertInviteUsableForEmail(
    userEmail: string,
    invite: {
      email: string;
      expiresAt: Date;
      acceptedAt: Date | null;
      revokedAt: Date | null;
    },
    now: Date,
  ) {
    if (invite.revokedAt || invite.acceptedAt) {
      throw new BadRequestException(
        OrganizationErrorMessages.INVITE_ALREADY_USED_OR_REVOKED,
      );
    }

    if (now > invite.expiresAt) {
      throw new BadRequestException(OrganizationErrorMessages.INVITE_EXPIRED);
    }

    const normalizedUserEmail = normalizeEmail(userEmail);
    const inviteEmail = normalizeEmail(invite.email);

    if (!normalizedUserEmail) {
      throw new BadRequestException(
        OrganizationErrorMessages.INVITE_EMAIL_REQUIRED,
      );
    }

    if (normalizedUserEmail !== inviteEmail) {
      throw new ForbiddenException(
        OrganizationErrorMessages.INVITE_EMAIL_MISMATCH,
      );
    }
  }

  async createInvite(
    actor: AuthUser,
    email: string,
    db?: Db,
  ): Promise<OrganizationInviteView> {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new BadRequestException(
        OrganizationErrorMessages.INVITE_EMAIL_REQUIRED,
      );
    }

    return runInTx(this.uow, db, async (tx) => {
      const actorRole = await this.getActorRoleInOrg(actor, tx);

      if (!canCreateInvites(actorRole)) {
        throw new ForbiddenException(
          OrganizationErrorMessages.ONLY_OWNERS_ADMINS_CAN_CREATE_INVITES,
        );
      }

      const token = generateInviteToken();
      const tokenHash = inviteTokenHash(token);
      const tokenPrefix = inviteTokenPrefix(token);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

      const invite = await this.invitesRepository.create(
        {
          organizationId: actor.orgId,
          email: normalizedEmail,
          tokenHash,
          tokenPrefix,
          expiresAt,
          createdById: actor.id,
        },
        tx,
      );

      const inviteUrl = this.inviteUrlService.buildInviteUrl(token);

      this.logger.info(
        {
          event: 'organization.invite.created',
          organizationId: actor.orgId,
          email: normalizedEmail,
          createdById: actor.id,
        },
        'Organization invite created',
      );

      return {
        inviteUrl,
        email: normalizedEmail,
        expiresAt: invite.expiresAt.toISOString(),
      };
    });
  }

  async listInvitesForOrg(
    actor: AuthUser,
    db?: Db,
  ): Promise<OrganizationInviteAdminView[]> {
    return runInTx(this.uow, db, async (tx) => {
      const actorRole = await this.getActorRoleInOrg(actor, tx);

      if (!canCreateInvites(actorRole)) {
        throw new ForbiddenException(
          OrganizationErrorMessages.ONLY_OWNERS_ADMINS_CAN_CREATE_INVITES,
        );
      }

      return this.invitesRepository.listForOrganization(actor.orgId, tx);
    });
  }

  async revokeInvite(
    actor: AuthUser,
    inviteId: string,
    db?: Db,
  ): Promise<void> {
    return runInTx(this.uow, db, async (tx) => {
      const actorRole = await this.getActorRoleInOrg(actor, tx);

      if (!canRevokeInvites(actorRole)) {
        throw new ForbiddenException(
          OrganizationErrorMessages.ONLY_OWNERS_ADMINS_CAN_CREATE_INVITES,
        );
      }

      const invite = await this.invitesRepository.findById(inviteId, tx);
      if (!invite || invite.organizationId !== actor.orgId) {
        throw new BadRequestException(
          OrganizationErrorMessages.INVITE_INVALID_OR_EXPIRED,
        );
      }

      const now = new Date();
      const updated = await this.invitesRepository.markRevoked(
        inviteId,
        now,
        tx,
      );

      if (updated === 0) {
        throw new BadRequestException(
          OrganizationErrorMessages.INVITE_ALREADY_USED_OR_REVOKED,
        );
      }

      this.logger.info(
        {
          event: 'organization.invite.revoked',
          userId: actor.id,
          inviteId,
          organizationId: actor.orgId,
        },
        'Organization invite revoked',
      );
    });
  }

  async getPendingInvitesForUser(
    userId: string,
    db?: Db,
  ): Promise<PendingInviteView[]> {
    return runInTx(this.uow, db, async (tx) => {
      const user = await this.usersRepository.findById(userId, tx);
      if (!user) return [];
      const email = normalizeEmail(user.email);
      if (!email) return [];
      return this.invitesRepository.findPendingByEmail(email, tx);
    });
  }

  async acceptInvite(userId: string, token: string, db?: Db): Promise<void> {
    const trimmed = token.trim();
    if (!trimmed) {
      throw new BadRequestException(
        OrganizationErrorMessages.INVITE_TOKEN_REQUIRED,
      );
    }

    const tokenHash = inviteTokenHash(trimmed);
    const tokenPrefix = inviteTokenPrefix(trimmed);

    return runInTx(this.uow, db, async (tx) => {
      const user = await this.usersRepository.findById(userId, tx);
      if (!user) {
        throw new BadRequestException(OrganizationErrorMessages.USER_NOT_FOUND);
      }

      const invite = await this.invitesRepository.findByTokenHashAndPrefix(
        tokenHash,
        tokenPrefix,
        tx,
      );

      if (!invite) {
        throw new BadRequestException(
          OrganizationErrorMessages.INVITE_INVALID_OR_EXPIRED,
        );
      }

      const now = new Date();
      await this.acceptInviteRecord(
        user.email,
        userId,
        invite.id,
        invite,
        now,
        tx,
      );
    });
  }

  async acceptInviteById(
    userId: string,
    inviteId: string,
    db?: Db,
  ): Promise<void> {
    return runInTx(this.uow, db, async (tx) => {
      const user = await this.usersRepository.findById(userId, tx);
      if (!user) {
        throw new BadRequestException(OrganizationErrorMessages.USER_NOT_FOUND);
      }

      const invite = await this.invitesRepository.findById(inviteId, tx);
      if (!invite) {
        throw new BadRequestException(
          OrganizationErrorMessages.INVITE_INVALID_OR_EXPIRED,
        );
      }

      const now = new Date();
      await this.acceptInviteRecord(
        user.email,
        userId,
        inviteId,
        invite,
        now,
        tx,
      );
    });
  }

  async declineInviteById(
    userId: string,
    inviteId: string,
    db?: Db,
  ): Promise<void> {
    return runInTx(this.uow, db, async (tx) => {
      const user = await this.usersRepository.findById(userId, tx);
      if (!user) {
        throw new BadRequestException(OrganizationErrorMessages.USER_NOT_FOUND);
      }

      const invite = await this.invitesRepository.findById(inviteId, tx);
      if (!invite) {
        throw new BadRequestException(
          OrganizationErrorMessages.INVITE_INVALID_OR_EXPIRED,
        );
      }

      const now = new Date();
      this.assertInviteUsableForEmail(user.email, invite, now);

      const updated = await this.invitesRepository.markRevoked(
        inviteId,
        now,
        tx,
      );

      if (updated === 0) {
        throw new BadRequestException(
          OrganizationErrorMessages.INVITE_ALREADY_USED_OR_REVOKED,
        );
      }

      this.logger.info(
        {
          event: 'organization.invite.declined',
          userId,
          inviteId,
          organizationId: invite.organizationId,
        },
        'Organization invite declined',
      );
    });
  }

  private async acceptInviteRecord(
    userEmail: string,
    userId: string,
    inviteId: string,
    invite: {
      organizationId: string;
      email: string;
      expiresAt: Date;
      acceptedAt: Date | null;
      revokedAt: Date | null;
    },
    now: Date,
    db?: Db,
  ): Promise<void> {
    this.assertInviteUsableForEmail(userEmail, invite, now);

    const updated = await this.invitesRepository.markAccepted(
      inviteId,
      now,
      db,
    );

    if (updated === 0) {
      if (invite.expiresAt <= now) {
        throw new BadRequestException(OrganizationErrorMessages.INVITE_EXPIRED);
      }

      throw new BadRequestException(
        OrganizationErrorMessages.INVITE_ALREADY_USED_OR_REVOKED,
      );
    }

    await this.organizationMembershipsService.addMembershipIfMissing(
      userId,
      invite.organizationId,
      DEFAULT_MEMBER_ROLE,
      db,
    );

    await this.usersRepository.updateOrganization(
      userId,
      invite.organizationId,
      db,
    );

    this.logger.info(
      {
        event: 'organization.invite.accepted',
        userId,
        organizationId: invite.organizationId,
      },
      'Organization invite accepted',
    );
  }
}

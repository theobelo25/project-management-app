import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthUser,
  OrganizationInviteView,
  PendingInviteView,
  UserView,
} from '@repo/types';
import { Db } from '@api/prisma';
import { OrganizationInvitesRepository } from './repositories/organization-invites.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import {
  generateInviteToken,
  inviteTokenHash,
  inviteTokenPrefix,
} from './utils/invite-token.util';
import { PinoLogger } from 'nestjs-pino';

const INVITE_EXPIRY_DAYS = 7;

function normalizeEmail(email: string | undefined | null): string {
  return (email ?? '').trim().toLowerCase();
}

@Injectable()
export class OrganizationInvitesService {
  constructor(
    private readonly invitesRepository: OrganizationInvitesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(OrganizationInvitesService.name);
  }

  async createInvite(
    actor: AuthUser,
    email: string,
    db?: Db,
  ): Promise<OrganizationInviteView> {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) throw new BadRequestException('Email is required');

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
      db,
    );

    const frontendOrigin = this.configService.get<string>('app.frontendOrigin');
    const inviteUrl = `${frontendOrigin}/invite?token=${encodeURIComponent(token)}`;

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
  }

  async getPendingInvitesForUser(
    currentUser: UserView,
    db?: Db,
  ): Promise<PendingInviteView[]> {
    const email = normalizeEmail(currentUser.email);
    if (!email) return [];
    return this.invitesRepository.findPendingByEmail(email, db);
  }

  async acceptInvite(
    currentUser: UserView,
    token: string,
    db?: Db,
  ): Promise<void> {
    const tokenHash = inviteTokenHash(token.trim());
    const invite = await this.invitesRepository.findByTokenHash(tokenHash, db);
    if (!invite) throw new BadRequestException('Invalid or expired invite');
    await this.acceptInviteRecord(currentUser, invite.id, invite, db);
  }

  async acceptInviteById(
    currentUser: UserView,
    inviteId: string,
    db?: Db,
  ): Promise<void> {
    const invite = await this.invitesRepository.findById(inviteId, db);
    if (!invite) throw new BadRequestException('Invalid or expired invite');
    await this.acceptInviteRecord(currentUser, inviteId, invite, db);
  }

  async declineInviteById(
    currentUser: UserView,
    inviteId: string,
    db?: Db,
  ): Promise<void> {
    const invite = await this.invitesRepository.findById(inviteId, db);
    if (!invite) throw new BadRequestException('Invalid or expired invite');

    if (invite.revokedAt || invite.acceptedAt)
      throw new BadRequestException('Invite has already been used or revoked');
    if (new Date() > invite.expiresAt)
      throw new BadRequestException('Invite has expired');

    const userEmail = normalizeEmail(currentUser.email);
    const inviteEmail = normalizeEmail(invite.email);
    if (userEmail !== inviteEmail)
      throw new ForbiddenException(
        'This invite was sent to a different email address',
      );

    await this.invitesRepository.markRevoked(inviteId, db);

    this.logger.info(
      {
        event: 'organization.invite.declined',
        userId: currentUser.id,
        inviteId,
        organizationId: invite.organizationId,
      },
      'Organization invite declined',
    );
  }

  private async acceptInviteRecord(
    currentUser: UserView,
    inviteId: string,
    invite: {
      organizationId: string;
      email: string;
      expiresAt: Date;
      acceptedAt: Date | null;
      revokedAt: Date | null;
    },
    db?: Db,
  ): Promise<void> {
    if (invite.revokedAt || invite.acceptedAt)
      throw new BadRequestException('Invite has already been used or revoked');
    if (new Date() > invite.expiresAt)
      throw new BadRequestException('Invite has expired');

    const userEmail = normalizeEmail(currentUser.email);
    const inviteEmail = normalizeEmail(invite.email);
    if (userEmail !== inviteEmail)
      throw new ForbiddenException(
        'This invite was sent to a different email address',
      );

    if (currentUser.orgId === invite.organizationId) {
      await this.invitesRepository.markAccepted(inviteId, db);
      return;
    }

    await this.usersRepository.updateOrganization(
      currentUser.id,
      invite.organizationId,
      db,
    );
    await this.invitesRepository.markAccepted(inviteId, db);

    this.logger.info(
      {
        event: 'organization.invite.accepted',
        userId: currentUser.id,
        organizationId: invite.organizationId,
      },
      'Organization invite accepted',
    );
  }
}

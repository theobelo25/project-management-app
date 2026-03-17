import { Inject, Injectable } from '@nestjs/common';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import { PendingInviteView } from '@repo/types';
import { OrganizationInvitesRepository } from './organization-invites.repository';
import {
  CreateOrganizationInviteInput,
  OrganizationInviteRecord,
} from '../types/organization-invite.repository.types';

@Injectable()
export class PrismaOrganizationInvitesRepository extends OrganizationInvitesRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  async create(
    input: CreateOrganizationInviteInput,
    db?: Db,
  ): Promise<OrganizationInviteRecord> {
    const prisma = db ?? this.prisma;
    const invite = await prisma.organizationInvite.create({
      data: {
        organizationId: input.organizationId,
        email: input.email,
        tokenHash: input.tokenHash,
        tokenPrefix: input.tokenPrefix,
        expiresAt: input.expiresAt,
        createdById: input.createdById,
      },
    });
    return this.toRecord(invite);
  }

  async findByTokenHash(
    tokenHash: string,
    db?: Db,
  ): Promise<OrganizationInviteRecord | null> {
    const prisma = db ?? this.prisma;
    const invite = await prisma.organizationInvite.findUnique({
      where: { tokenHash },
    });
    return invite ? this.toRecord(invite) : null;
  }

  async findById(
    inviteId: string,
    db?: Db,
  ): Promise<OrganizationInviteRecord | null> {
    const prisma = db ?? this.prisma;
    const invite = await prisma.organizationInvite.findUnique({
      where: { id: inviteId },
    });
    return invite ? this.toRecord(invite) : null;
  }

  async findPendingByEmail(
    email: string,
    db?: Db,
  ): Promise<PendingInviteView[]> {
    const prisma = db ?? this.prisma;

    const invites = await prisma.organizationInvite.findMany({
      where: {
        email,
        acceptedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        organization: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return invites.map((invite) => ({
      id: invite.id,
      organizationName: invite.organization.name,
      email: invite.email,
      expiresAt: invite.expiresAt.toISOString(),
    }));
  }

  async markAccepted(inviteId: string, db?: Db): Promise<void> {
    const prisma = db ?? this.prisma;
    await prisma.organizationInvite.update({
      where: { id: inviteId },
      data: { acceptedAt: new Date() },
    });
  }

  async markRevoked(inviteId: string, db?: Db): Promise<void> {
    const prisma = db ?? this.prisma;
    await prisma.organizationInvite.update({
      where: { id: inviteId },
      data: { revokedAt: new Date() },
    });
  }

  private toRecord(invite: {
    id: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    revokedAt: Date | null;
    createdById: string;
    createdAt: Date;
  }): OrganizationInviteRecord {
    return {
      id: invite.id,
      organizationId: invite.organizationId,
      email: invite.email,
      tokenHash: invite.tokenHash,
      tokenPrefix: invite.tokenPrefix,
      expiresAt: invite.expiresAt,
      acceptedAt: invite.acceptedAt,
      revokedAt: invite.revokedAt,
      createdById: invite.createdById,
      createdAt: invite.createdAt,
    };
  }
}

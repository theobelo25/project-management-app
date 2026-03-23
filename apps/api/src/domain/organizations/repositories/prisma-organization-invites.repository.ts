import { Inject, Injectable } from '@nestjs/common';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import { OrganizationInviteAdminView, PendingInviteView } from '@repo/types';
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

  async findByTokenHashAndPrefix(
    tokenHash: string,
    tokenPrefix: string,
    db?: Db,
  ): Promise<OrganizationInviteRecord | null> {
    const prisma = db ?? this.prisma;

    const invite = await prisma.organizationInvite.findFirst({
      where: { tokenHash, tokenPrefix },
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

  async findPendingForOrganizationAndEmail(
    organizationId: string,
    email: string,
    db?: Db,
  ): Promise<OrganizationInviteRecord | null> {
    const prisma = db ?? this.prisma;
    const now = new Date();

    const invite = await prisma.organizationInvite.findFirst({
      where: {
        organizationId,
        email,
        acceptedAt: null,
        revokedAt: null,
        expiresAt: { gt: now },
      },
    });

    return invite ? this.toRecord(invite) : null;
  }

  async listForOrganization(
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationInviteAdminView[]> {
    const prisma = db ?? this.prisma;

    const invites = await prisma.organizationInvite.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        createdById: true,
      },
    });

    return invites.map((i) => ({
      id: i.id,
      email: i.email,
      createdAt: i.createdAt.toISOString(),
      expiresAt: i.expiresAt.toISOString(),
      acceptedAt: i.acceptedAt ? i.acceptedAt.toISOString() : null,
      revokedAt: i.revokedAt ? i.revokedAt.toISOString() : null,
      createdById: i.createdById,
    }));
  }

  async markAccepted(inviteId: string, now: Date, db?: Db): Promise<number> {
    const prisma = db ?? this.prisma;

    const res = await prisma.organizationInvite.updateMany({
      where: {
        id: inviteId,
        acceptedAt: null,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: { acceptedAt: now },
    });

    return res.count;
  }

  async markRevoked(inviteId: string, now: Date, db?: Db): Promise<number> {
    const prisma = db ?? this.prisma;

    const res = await prisma.organizationInvite.updateMany({
      where: {
        id: inviteId,
        acceptedAt: null,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: { revokedAt: now },
    });

    return res.count;
  }

  private toRecord(invite: {
    id: string;
    organizationId: string;
    email: string;
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
      tokenPrefix: invite.tokenPrefix,
      expiresAt: invite.expiresAt,
      acceptedAt: invite.acceptedAt,
      revokedAt: invite.revokedAt,
      createdById: invite.createdById,
      createdAt: invite.createdAt,
    };
  }
}

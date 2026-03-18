import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import {
  OrganizationDetailView,
  OrganizationMemberView,
  OrganizationView,
} from '@repo/types';

@Injectable()
export class OrganizationMembershipsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async listOrganizationsForUser(
    userId: string,
    db?: Db,
  ): Promise<OrganizationView[]> {
    const prisma = (db ?? this.prisma) as PrismaClient;

    const memberships = await prisma.organizationMembership.findMany({
      where: { userId },
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      role: membership.role,
      joinedAt: membership.createdAt.toISOString(),
    }));
  }

  async getOrganizationNameForUser(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<string | null> {
    const prisma = (db ?? this.prisma) as PrismaClient;

    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: { userId, organizationId },
      },
      include: { organization: { select: { name: true } } },
    });

    return membership?.organization.name ?? null;
  }

  async getOrganizationDetails(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationDetailView> {
    const prisma = (db ?? this.prisma) as PrismaClient;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        organizationMemberships: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const membership = await this.assertMembership(userId, organizationId, db);

    return {
      id: organization.id,
      name: organization.name,
      role: membership.role,
      joinedAt: membership.createdAt.toISOString(),
      members: organization.organizationMemberships.map(
        (organizationMembership) => ({
          id: organizationMembership.user.id,
          name: organizationMembership.user.name,
          email: organizationMembership.user.email,
          role: organizationMembership.role,
          joinedAt: organizationMembership.createdAt.toISOString(),
        }),
      ),
    };
  }

  async assertMembership(userId: string, organizationId: string, db?: Db) {
    const prisma = (db ?? this.prisma) as PrismaClient;

    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: { userId, organizationId },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    return membership;
  }

  async setActiveOrganization(userId: string, organizationId: string, db?: Db) {
    const prisma = (db ?? this.prisma) as PrismaClient;

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    await this.assertMembership(userId, organizationId, db);

    await prisma.user.update({
      where: { id: userId },
      data: { activeOrganizationId: organizationId },
    });
  }

  async addMembershipIfMissing(
    userId: string,
    organizationId: string,
    role: 'OWNER' | 'ADMIN' | 'MEMBER' = 'MEMBER',
    db?: Db,
  ) {
    const prisma = (db ?? this.prisma) as PrismaClient;

    await prisma.organizationMembership.upsert({
      where: { userId_organizationId: { userId, organizationId } },
      update: {},
      create: { userId, organizationId, role },
    });
  }

  async addMember(
    actorUserId: string,
    organizationId: string,
    memberUserId: string,
    db?: Db,
  ): Promise<OrganizationMemberView> {
    const prisma = (db ?? this.prisma) as PrismaClient;

    const actorMembership = await this.assertMembership(
      actorUserId,
      organizationId,
      db,
    );

    if (actorMembership.role === 'MEMBER') {
      throw new ForbiddenException(
        'Only organization owners and admins can add members',
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: memberUserId },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const existingMembership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: { userId: memberUserId, organizationId },
      },
    });

    if (existingMembership) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const membership = await prisma.organizationMembership.create({
      data: {
        userId: memberUserId,
        organizationId,
        role: 'MEMBER',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return {
      id: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      role: membership.role,
      joinedAt: membership.createdAt.toISOString(),
    };
  }
}

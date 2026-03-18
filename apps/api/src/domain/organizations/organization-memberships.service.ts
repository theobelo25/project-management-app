import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PRISMA } from '@api/prisma';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { Db } from '@api/prisma';

@Injectable()
export class OrganizationMembershipsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async listOrganizationsForUser(userId: string, db?: Db) {
    const prisma = (db ?? this.prisma) as PrismaClient;

    const memberships = await prisma.organizationMembership.findMany({
      where: { userId },
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
      joinedAt: m.createdAt.toISOString(),
    }));
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

    // Ensure org exists
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    // Ensure membership
    await this.assertMembership(userId, organizationId, db);

    // Persist active org
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
}

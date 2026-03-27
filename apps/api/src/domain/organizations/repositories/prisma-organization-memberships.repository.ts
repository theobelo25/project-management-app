import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import { getPaginationParams } from '@api/common';
import {
  OrganizationDetailView,
  OrganizationMemberView,
  OrganizationRole,
  OrganizationView,
  PaginatedOrganizationMembersView,
  OrganizationSummaryView,
} from '@repo/types';
import type { PaginationQuery } from '@repo/types';

import { OrganizationMembershipsRepository } from './organization-memberships.repository';
import { OWNER_ROLE } from '../constants/organization-roles';
import { OrganizationErrorMessages } from '../constants/error-messages';

@Injectable()
export class PrismaOrganizationMembershipsRepository extends OrganizationMembershipsRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  async listOrganizationsForUser(
    userId: string,
    db?: Db,
  ): Promise<OrganizationView[]> {
    const prisma = db ?? this.prisma;

    const memberships = await prisma.organizationMembership.findMany({
      where: { userId },
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      role: membership.role as OrganizationRole,
      joinedAt: membership.createdAt.toISOString(),
    }));
  }

  async getOrganizationNameForUser(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<string | null> {
    const prisma = db ?? this.prisma;

    const membership = await prisma.organizationMembership.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
      include: { organization: { select: { name: true } } },
    });

    return membership?.organization.name ?? null;
  }

  async getOrganizationSummaryForUser(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationSummaryView | null> {
    const prisma = db ?? this.prisma;

    const myMembership = await prisma.organizationMembership.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
      select: {
        role: true,
        createdAt: true,
        organization: { select: { id: true, name: true } },
      },
    });

    if (!myMembership) return null;

    return {
      id: myMembership.organization.id,
      name: myMembership.organization.name,
      role: myMembership.role as OrganizationRole,
      joinedAt: myMembership.createdAt.toISOString(),
    };
  }

  async getOrganizationDetailsForUser(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationDetailView | null> {
    const prisma = db ?? this.prisma;

    const myMembership = await prisma.organizationMembership.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
      select: {
        role: true,
        createdAt: true,
        organization: { select: { id: true, name: true } },
      },
    });
    if (!myMembership) return null;

    const memberships = await prisma.organizationMembership.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
      select: {
        role: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return {
      id: myMembership.organization.id,
      name: myMembership.organization.name,
      role: myMembership.role as OrganizationRole,
      joinedAt: myMembership.createdAt.toISOString(),
      members: memberships.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role as OrganizationRole,
        joinedAt: m.createdAt.toISOString(),
      })),
    };
  }

  async organizationExists(organizationId: string, db?: Db): Promise<boolean> {
    const prisma = db ?? this.prisma;

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });

    return !!org;
  }

  async findMembershipRole(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationRole | null> {
    const prisma = db ?? this.prisma;

    const membership = await prisma.organizationMembership.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
      select: { role: true },
    });

    return (membership?.role as OrganizationRole) ?? null;
  }

  async setActiveOrganization(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.user.update({
      where: { id: userId },
      data: { activeOrganizationId: organizationId },
    });
  }

  async addMembershipIfMissing(
    userId: string,
    organizationId: string,
    role: OrganizationRole,
    db?: Db,
  ): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.organizationMembership.upsert({
      where: { userId_organizationId: { userId, organizationId } },
      update: {},
      create: { userId, organizationId, role },
    });
  }

  async addMemberMembership(
    organizationId: string,
    memberUserId: string,
    role: OrganizationRole,
    db?: Db,
  ): Promise<OrganizationMemberView | null> {
    const prisma = db ?? this.prisma;

    const targetUser = await prisma.user.findUnique({
      where: { id: memberUserId },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) return null;

    const membership = await prisma.organizationMembership.create({
      data: {
        userId: memberUserId,
        organizationId,
        role,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return {
      id: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      role: membership.role as OrganizationRole,
      joinedAt: membership.createdAt.toISOString(),
    } satisfies OrganizationMemberView;
  }

  async listMembersPaginated(
    organizationId: string,
    query: PaginationQuery,
    db?: Db,
  ): Promise<PaginatedOrganizationMembersView> {
    const prisma = db ?? this.prisma;

    const {
      skip,
      take,
      page: currentPage,
      limit: pageSize,
    } = getPaginationParams(query);

    const [total, memberships] = await Promise.all([
      prisma.organizationMembership.count({ where: { organizationId } }),
      prisma.organizationMembership.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'asc' },
        skip,
        take,
        select: {
          role: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: memberships.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role as OrganizationRole,
        joinedAt: m.createdAt.toISOString(),
      })),
      page: currentPage,
      pageSize,
      total,
      totalPages,
    };
  }

  async countOwners(organizationId: string, db?: Db): Promise<number> {
    const prisma = db ?? this.prisma;

    return prisma.organizationMembership.count({
      where: { organizationId, role: OWNER_ROLE },
    });
  }

  async removeMember(
    organizationId: string,
    memberUserId: string,
    db?: Db,
  ): Promise<void> {
    const prisma = db ?? this.prisma;

    // deleteMany so it’s idempotent-ish; you can change to delete() if you prefer strictness.
    const res = await prisma.organizationMembership.deleteMany({
      where: { organizationId, userId: memberUserId },
    });

    if (res.count === 0) {
      throw new NotFoundException(OrganizationErrorMessages.NOT_MEMBER);
    }
  }

  async updateMemberRole(
    organizationId: string,
    memberUserId: string,
    role: OrganizationRole,
    db?: Db,
  ): Promise<void> {
    const prisma = db ?? this.prisma;

    const res = await prisma.organizationMembership.updateMany({
      where: { organizationId, userId: memberUserId },
      data: { role },
    });

    if (res.count === 0) {
      throw new NotFoundException(OrganizationErrorMessages.NOT_MEMBER);
    }
  }

  async removeMembership(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.organizationMembership.delete({
      where: { userId_organizationId: { userId, organizationId } },
    });
  }

  async findAnotherOwner(
    organizationId: string,
    excludedUserId: string,
    db?: Db,
  ): Promise<boolean> {
    const prisma = db ?? this.prisma;

    const owner = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: { not: excludedUserId },
        role: OWNER_ROLE,
      },
      select: { userId: true },
    });

    return !!owner;
  }

  async findReassignmentOrganizationId(
    userId: string,
    excludedOrganizationId: string,
    preferredOrganizationId: string | null,
    db?: Db,
  ): Promise<string | null> {
    const prisma = db ?? this.prisma;

    if (
      preferredOrganizationId &&
      preferredOrganizationId !== excludedOrganizationId
    ) {
      const preferredMembership =
        await prisma.organizationMembership.findUnique({
          where: {
            userId_organizationId: {
              userId,
              organizationId: preferredOrganizationId,
            },
          },
          select: { organizationId: true },
        });

      if (preferredMembership) {
        return preferredMembership.organizationId;
      }
    }

    const fallbackMembership = await prisma.organizationMembership.findFirst({
      where: {
        userId,
        organizationId: { not: excludedOrganizationId },
      },
      orderBy: { createdAt: 'desc' },
      select: { organizationId: true },
    });

    return fallbackMembership?.organizationId ?? null;
  }

  async findReassignmentOrganizationIdsForUsers(
    users: Array<{
      userId: string;
      preferredOrganizationId: string | null;
    }>,
    excludedOrganizationId: string,
    db?: Db,
  ): Promise<
    Array<{
      userId: string;
      reassignmentOrganizationId: string | null;
    }>
  > {
    const prisma = db ?? this.prisma;

    const userIds = users.map((u) => u.userId);

    const preferredPairs = users.filter(
      (u) =>
        u.preferredOrganizationId &&
        u.preferredOrganizationId !== excludedOrganizationId,
    ) as Array<{
      userId: string;
      preferredOrganizationId: string;
    }>;

    const preferredOrgIds = [
      ...new Set(preferredPairs.map((p) => p.preferredOrganizationId)),
    ];

    const preferredMemberships = preferredOrgIds.length
      ? await prisma.organizationMembership.findMany({
          where: {
            userId: { in: userIds },
            organizationId: { in: preferredOrgIds },
          },
          select: { userId: true, organizationId: true },
        })
      : [];

    const preferredMap = new Map(
      preferredMemberships.map((m) => [m.userId, m.organizationId]),
    );

    const remainingUserIds = userIds.filter((id) => !preferredMap.has(id));

    const fallbackMemberships = remainingUserIds.length
      ? await prisma.organizationMembership.findMany({
          where: {
            userId: { in: remainingUserIds },
            organizationId: { not: excludedOrganizationId },
          },
          orderBy: { createdAt: 'desc' },
          distinct: ['userId'],
          select: { userId: true, organizationId: true },
        })
      : [];

    const fallbackMap = new Map(
      fallbackMemberships.map((m) => [m.userId, m.organizationId]),
    );

    return users.map((u) => {
      if (preferredMap.has(u.userId)) {
        return {
          userId: u.userId,
          reassignmentOrganizationId: preferredMap.get(u.userId) ?? null,
        };
      }

      return {
        userId: u.userId,
        reassignmentOrganizationId: fallbackMap.get(u.userId) ?? null,
      };
    });
  }
}

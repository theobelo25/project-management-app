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
import { Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWork,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(OrganizationsService.name);
  }

  async createOrganization(userId: string, name: string) {
    const organizationName = name.trim();
    if (!organizationName) {
      throw new BadRequestException('Organization name is required');
    }

    return this.uow.transaction(async (db) => {
      const organization = await db.organization.create({
        data: {
          name: organizationName,
        },
      });

      await db.organizationMembership.create({
        data: {
          userId,
          organizationId: organization.id,
          role: 'OWNER',
        },
      });

      await db.user.update({
        where: { id: userId },
        data: {
          activeOrganizationId: organization.id,
          defaultOrganizationId: organization.id,
        },
      });

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
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          activeOrganizationId: true,
          defaultOrganizationId: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const membership = await db.organizationMembership.findUnique({
        where: {
          userId_organizationId: { userId, organizationId },
        },
        select: { role: true },
      });

      if (!membership) {
        throw new ForbiddenException(
          'You are not a member of this organization',
        );
      }

      if (membership.role === 'OWNER') {
        const anotherOwner = await db.organizationMembership.findFirst({
          where: {
            organizationId,
            userId: { not: userId },
            role: 'OWNER',
          },
          select: { id: true },
        });

        if (!anotherOwner) {
          throw new BadRequestException(
            'You cannot leave this organization because you are the last owner',
          );
        }
      }

      const isActiveOrganization = user.activeOrganizationId === organizationId;

      if (isActiveOrganization) {
        const fallbackOrganizationId =
          await this.findReassignmentOrganizationId(
            userId,
            organizationId,
            user.defaultOrganizationId,
            db,
          );

        if (!fallbackOrganizationId) {
          throw new BadRequestException(
            'You must belong to at least one other organization before leaving this one',
          );
        }

        const updateData: {
          activeOrganizationId: string;
          defaultOrganizationId?: string;
        } = {
          activeOrganizationId: fallbackOrganizationId,
        };

        if (user.defaultOrganizationId === organizationId) {
          updateData.defaultOrganizationId = fallbackOrganizationId;
        }

        await db.user.update({
          where: { id: userId },
          data: updateData,
        });
      }

      await db.organizationMembership.delete({
        where: {
          userId_organizationId: { userId, organizationId },
        },
      });

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
      const membership = await db.organizationMembership.findUnique({
        where: {
          userId_organizationId: { userId, organizationId },
        },
        select: { role: true },
      });

      if (!membership) {
        throw new ForbiddenException(
          'You are not a member of this organization',
        );
      }

      if (membership.role !== 'OWNER') {
        throw new ForbiddenException(
          'Only organization owners can delete an organization',
        );
      }

      const activeUsers = await db.user.findMany({
        where: { activeOrganizationId: organizationId },
        select: { id: true, defaultOrganizationId: true },
      });

      const reassignments: Array<{
        userId: string;
        organizationId: string;
        updateDefault: boolean;
      }> = [];

      for (const activeUser of activeUsers) {
        const reassignmentOrganizationId =
          await this.findReassignmentOrganizationId(
            activeUser.id,
            organizationId,
            activeUser.defaultOrganizationId,
            db,
          );

        if (!reassignmentOrganizationId) {
          throw new BadRequestException(
            'Cannot delete this organization because one or more members do not belong to another organization',
          );
        }

        reassignments.push({
          userId: activeUser.id,
          organizationId: reassignmentOrganizationId,
          updateDefault: activeUser.defaultOrganizationId === organizationId,
        });
      }

      for (const reassignment of reassignments) {
        await db.user.update({
          where: { id: reassignment.userId },
          data: {
            activeOrganizationId: reassignment.organizationId,
            ...(reassignment.updateDefault
              ? { defaultOrganizationId: reassignment.organizationId }
              : {}),
          },
        });
      }

      await db.organization.delete({
        where: { id: organizationId },
      });

      this.logger.info(
        {
          event: 'organization.deleted',
          userId,
          organizationId,
          reassignedUsers: reassignments.length,
        },
        'Organization deleted successfully',
      );
    });
  }

  private async findReassignmentOrganizationId(
    userId: string,
    excludedOrganizationId: string,
    preferredOrganizationId: string | null,
    db: Db,
  ): Promise<string | null> {
    const prisma = db as PrismaClient;

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

  async createWorkspaceEntity(name: string, tx: Db) {
    const organizationName = name.trim();
    if (!organizationName)
      throw new BadRequestException('Organization name is required');

    return tx.organization.create({
      data: { name: organizationName },
      select: { id: true },
    });
  }

  async createInitialWorkspaceForUserName(userName: string, tx: Db) {
    // Domain-owned naming policy (AuthService shouldn't embed this rule).
    return this.createWorkspaceEntity(`${userName}'s Workspace`, tx);
  }
}

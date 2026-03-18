import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_WORK } from '@api/prisma';
import { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';
import { PinoLogger } from 'nestjs-pino';

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
        data: { activeOrganizationId: organization.id },
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
}

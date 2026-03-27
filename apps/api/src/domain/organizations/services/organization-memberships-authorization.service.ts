import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Db, UNIT_OF_WORK } from '@api/prisma';
import type { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';

import { OrganizationErrorMessages } from '../constants/error-messages';
import { OrganizationMembershipsRepository } from '../repositories/organization-memberships.repository';
import { runInTx } from '../utils/run-in-tx.util';

@Injectable()
export class OrganizationMembershipsAuthorizationService {
  constructor(
    private readonly repository: OrganizationMembershipsRepository,
    @Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork,
  ) {}

  async assertMembership(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<{ role: import('@repo/types').OrganizationRole }> {
    return runInTx(this.uow, db, async (tx) => {
      const role = await this.repository.findMembershipRole(
        userId,
        organizationId,
        tx,
      );

      if (!role) {
        throw new ForbiddenException(OrganizationErrorMessages.NOT_MEMBER);
      }

      return { role };
    });
  }
}

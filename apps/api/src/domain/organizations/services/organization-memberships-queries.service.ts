import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Db, UNIT_OF_WORK } from '@api/prisma';
import type { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';

import { OrganizationErrorMessages } from '../constants/error-messages';
import { OrganizationMembershipsRepository } from '../repositories/organization-memberships.repository';
import { runInTx } from '../utils/run-in-tx.util';

@Injectable()
export class OrganizationMembershipsQueriesService {
  constructor(
    private readonly repository: OrganizationMembershipsRepository,
    @Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork,
  ) {}

  listOrganizationsForUser(userId: string, db?: Db) {
    return runInTx(this.uow, db, (tx) =>
      this.repository.listOrganizationsForUser(userId, tx),
    );
  }

  getOrganizationNameForUser(userId: string, organizationId: string, db?: Db) {
    return runInTx(this.uow, db, (tx) =>
      this.repository.getOrganizationNameForUser(userId, organizationId, tx),
    );
  }

  async getOrganizationDetails(
    userId: string,
    organizationId: string,
    db?: Db,
  ) {
    return runInTx(this.uow, db, async (tx) => {
      const details = await this.repository.getOrganizationDetailsForUser(
        userId,
        organizationId,
        tx,
      );

      if (details) return details;

      const orgExists = await this.repository.organizationExists(
        organizationId,
        tx,
      );
      if (!orgExists) {
        throw new NotFoundException(
          OrganizationErrorMessages.ORGANIZATION_NOT_FOUND,
        );
      }

      throw new ForbiddenException(OrganizationErrorMessages.NOT_MEMBER);
    });
  }

  async getOrganizationSummary(
    userId: string,
    organizationId: string,
    db?: Db,
  ) {
    return runInTx(this.uow, db, async (tx) => {
      const summary = await this.repository.getOrganizationSummaryForUser(
        userId,
        organizationId,
        tx,
      );

      if (summary) return summary;

      const orgExists = await this.repository.organizationExists(
        organizationId,
        tx,
      );
      if (!orgExists) {
        throw new NotFoundException(
          OrganizationErrorMessages.ORGANIZATION_NOT_FOUND,
        );
      }

      throw new ForbiddenException(OrganizationErrorMessages.NOT_MEMBER);
    });
  }

  listMembers(organizationId: string, page: number, limit: number, db?: Db) {
    return runInTx(this.uow, db, (tx) =>
      this.repository.listMembersPaginated(organizationId, page, limit, tx),
    );
  }
}

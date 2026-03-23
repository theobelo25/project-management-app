import { BadRequestException, Injectable } from '@nestjs/common';
import { Db } from '@api/prisma';
import { OrganizationErrorMessages } from '../constants/error-messages';
import { OrganizationWorkspaceBootstrap } from '../organization-workspace-bootstrap.interface';

@Injectable()
export class OrganizationWorkspacesService implements OrganizationWorkspaceBootstrap {
  async createOrganizationEntity(
    name: string,
    tx: Db,
  ): Promise<{ id: string }> {
    const organizationName = name.trim();
    if (!organizationName) {
      throw new BadRequestException(
        OrganizationErrorMessages.ORGANIZATION_NAME_REQUIRED,
      );
    }

    return tx.organization.create({
      data: { name: organizationName },
      select: { id: true },
    });
  }

  async createInitialOrganizationForUserName(
    userName: string,
    tx: Db,
  ): Promise<{ id: string }> {
    return this.createOrganizationEntity(`${userName}'s Workspace`, tx);
  }
}

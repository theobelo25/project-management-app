import { Db } from '@api/prisma';

export const ORGANIZATION_WORKSPACE_BOOTSTRAP = Symbol(
  'ORGANIZATION_WORKSPACE_BOOTSTRAP',
);

export interface OrganizationWorkspaceBootstrap {
  createInitialOrganizationForUserName(
    userName: string,
    tx: Db,
  ): Promise<{ id: string }>;
}

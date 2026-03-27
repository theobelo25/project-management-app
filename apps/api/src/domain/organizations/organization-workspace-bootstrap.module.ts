import { Module } from '@nestjs/common';
import { PrismaModule } from '@api/prisma';
import { OrganizationWorkspacesService } from './services/organization-workspaces.service';
import { ORGANIZATION_WORKSPACE_BOOTSTRAP } from './organization-workspace-bootstrap.interface';

@Module({
  imports: [PrismaModule],
  providers: [
    OrganizationWorkspacesService,
    {
      provide: ORGANIZATION_WORKSPACE_BOOTSTRAP,
      useExisting: OrganizationWorkspacesService,
    },
  ],
  exports: [OrganizationWorkspacesService, ORGANIZATION_WORKSPACE_BOOTSTRAP],
})
export class OrganizationWorkspaceBootstrapModule {}

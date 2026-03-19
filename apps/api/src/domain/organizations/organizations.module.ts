import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationInvitesService } from './services/organization-invites.service';
import { OrganizationInvitesRepository } from './repositories/organization-invites.repository';
import { PrismaOrganizationInvitesRepository } from './repositories/prisma-organization-invites.repository';
import { UsersModule } from '../users/users.module';
import { OrganizationMembershipsService } from './services/organization-memberships.service';
import { AuthTokensModule } from '../auth/auth-tokens.module';
import { OrganizationsDomainService } from './organizations.service';
import { OrganizationsApplicationService } from './services/organizations-app.service';
import { PrismaModule } from '@api/prisma';

import { OrganizationMembershipsQueriesService } from './services/organization-memberships-queries.service';
import { OrganizationMembershipsAuthorizationService } from './services/organization-memberships-authorization.service';
import { OrganizationMembershipsMutationsService } from './services/organization-memberships-mutations.service';

import { OrganizationWorkspacesService } from './services/organization-workspaces.service';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { PrismaOrganizationsRepository } from './repositories/prisma-organizations.repository';

import { OrganizationsAccessCookieRefreshInterceptor } from './interceptors/organizations-access-cookie-refresh.interceptor';
import { InviteUrlService } from './services/invite-url.service';
import { OrganizationMembershipsRepository } from './repositories/organization-memberships.repository';
import { PrismaOrganizationMembershipsRepository } from './repositories/prisma-organization-memberships.repository';

@Module({
  imports: [UsersModule, AuthTokensModule, PrismaModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsDomainService,
    OrganizationsApplicationService,
    OrganizationWorkspacesService,

    OrganizationInvitesService,
    OrganizationMembershipsService,
    OrganizationMembershipsQueriesService,
    OrganizationMembershipsAuthorizationService,
    OrganizationMembershipsMutationsService,
    InviteUrlService,

    OrganizationsAccessCookieRefreshInterceptor,

    {
      provide: OrganizationInvitesRepository,
      useClass: PrismaOrganizationInvitesRepository,
    },
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
    {
      provide: OrganizationMembershipsRepository,
      useClass: PrismaOrganizationMembershipsRepository,
    },
  ],
  exports: [OrganizationMembershipsService, OrganizationWorkspacesService],
})
export class OrganizationsModule {}

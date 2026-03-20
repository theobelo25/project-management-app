import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationInvitesService } from './services/organization-invites.service';
import { OrganizationInvitesRepository } from './repositories/organization-invites.repository';
import { PrismaOrganizationInvitesRepository } from './repositories/prisma-organization-invites.repository';
import { UsersModule } from '../users/users.module';
import { OrganizationMembershipsService } from './services/organization-memberships.service';
import { AuthTokensModule } from '../auth/auth-tokens.module';
import { OrganizationsDomainService } from './services/organizations-domain.service';
import { OrganizationsApplicationService } from './services/organizations-app.service';
import { PrismaModule } from '@api/prisma';

import { OrganizationMembershipsQueriesService } from './services/organization-memberships-queries.service';
import { OrganizationMembershipsAuthorizationService } from './services/organization-memberships-authorization.service';
import { OrganizationMembershipsMutationsService } from './services/organization-memberships-mutations.service';

import { OrganizationWorkspaceBootstrapModule } from './organization-workspace-bootstrap.module';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { PrismaOrganizationsRepository } from './repositories/prisma-organizations.repository';

import { OrganizationsAccessCookieRefreshInterceptor } from './interceptors/organizations-access-cookie-refresh.interceptor';
import { InviteUrlService } from './services/invite-url.service';
import { OrganizationMembershipsRepository } from './repositories/organization-memberships.repository';
import { PrismaOrganizationMembershipsRepository } from './repositories/prisma-organization-memberships.repository';

/**
 * OrganizationsApplicationService: HTTP-facing orchestration. OrganizationsDomainService:
 * core org lifecycle (create / leave / delete). Co-located under services/.
 */
@Module({
  imports: [
    UsersModule,
    AuthTokensModule,
    PrismaModule,
    OrganizationWorkspaceBootstrapModule,
  ],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsDomainService,
    OrganizationsApplicationService,

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
  exports: [
    OrganizationMembershipsService,
    OrganizationWorkspaceBootstrapModule,
  ],
})
export class OrganizationsModule {}

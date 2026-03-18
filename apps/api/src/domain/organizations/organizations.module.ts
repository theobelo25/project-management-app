import { Module, forwardRef } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationInvitesService } from './organization-invites.service';
import { OrganizationInvitesRepository } from './repositories/organization-invites.repository';
import { PrismaOrganizationInvitesRepository } from './repositories/prisma-organization-invites.repository';
import { UsersModule } from '../users/users.module';
import { OrganizationMembershipsService } from './organization-memberships.service';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsService } from './organizations.service';
import { PrismaModule } from '@api/prisma';

@Module({
  imports: [UsersModule, forwardRef(() => AuthModule), PrismaModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    OrganizationInvitesService,
    OrganizationMembershipsService,
    {
      provide: OrganizationInvitesRepository,
      useClass: PrismaOrganizationInvitesRepository,
    },
  ],
  exports: [
    OrganizationsService,
    OrganizationInvitesService,
    OrganizationMembershipsService,
  ],
})
export class OrganizationsModule {}

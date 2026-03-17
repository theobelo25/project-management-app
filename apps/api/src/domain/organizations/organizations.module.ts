import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationInvitesService } from './organization-invites.service';
import { OrganizationInvitesRepository } from './repositories/organization-invites.repository';
import { PrismaOrganizationInvitesRepository } from './repositories/prisma-organization-invites.repository';
import { PRISMA } from '@api/prisma';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationInvitesService,
    {
      provide: OrganizationInvitesRepository,
      useClass: PrismaOrganizationInvitesRepository,
    },
  ],
  exports: [OrganizationInvitesService],
})
export class OrganizationsModule {}

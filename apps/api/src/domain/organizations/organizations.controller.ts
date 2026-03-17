import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@api/common';
import {
  AuthUser,
  OrganizationInviteView,
  PendingInviteView,
  UserView,
} from '@repo/types';
import { OrganizationInvitesService } from './organization-invites.service';
import {
  AcceptOrganizationInviteDto,
  CreateOrganizationInviteDto,
} from './dto';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(
    private readonly organizationInvitesService: OrganizationInvitesService,
  ) {}

  @Post('invites')
  async createInvite(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrganizationInviteDto,
  ): Promise<OrganizationInviteView> {
    return this.organizationInvitesService.createInvite(user, dto.email);
  }

  @Get('invites')
  async getPendingInvites(
    @CurrentUser() user: UserView,
  ): Promise<PendingInviteView[]> {
    return this.organizationInvitesService.getPendingInvitesForUser(user);
  }

  @Post('invites/accept')
  async acceptInvite(
    @CurrentUser() user: UserView,
    @Body() dto: AcceptOrganizationInviteDto,
  ): Promise<{ success: true }> {
    await this.organizationInvitesService.acceptInvite(user, dto.token);
    return { success: true };
  }

  @Post('invites/:id/accept')
  async acceptInviteById(
    @CurrentUser() user: UserView,
    @Param('id') inviteId: string,
  ): Promise<{ success: true }> {
    await this.organizationInvitesService.acceptInviteById(user, inviteId);
    return { success: true };
  }

  @Post('invites/:id/decline')
  async declineInviteById(
    @CurrentUser() user: UserView,
    @Param('id') inviteId: string,
  ): Promise<{ success: true }> {
    await this.organizationInvitesService.declineInviteById(user, inviteId);
    return { success: true };
  }
}

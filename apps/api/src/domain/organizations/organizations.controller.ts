import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@api/common';
import {
  AuthUser,
  OrganizationInviteView,
  PendingInviteView,
  SuccessResponse,
  UserView,
} from '@repo/types';
import { OrganizationInvitesService } from './organization-invites.service';
import {
  AcceptOrganizationInviteDto,
  CreateOrganizationInviteDto,
} from './dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationMembershipsService } from './organization-memberships.service';
import { SwitchOrganizationParamsDto } from './dto/switch-organization-params.dto';
import { Response } from 'express';
import { CookiesService } from '../auth/cookies/cookies.service';
import { UsersService } from '../users/users.service';
import { AccessTokensService } from '../auth/accessTokens/access-tokens.service';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly organizationInvitesService: OrganizationInvitesService,
    private readonly organizationMembershipsService: OrganizationMembershipsService,
    private readonly usersService: UsersService,
    private readonly accessTokensService: AccessTokensService,
    private readonly cookiesService: CookiesService,
  ) {}

  // List orgs current user belongs to
  @Get()
  async listMyOrganizations(@CurrentUser() user: AuthUser) {
    return this.organizationMembershipsService.listOrganizationsForUser(
      user.id,
    );
  }

  // Create a new org, make it active, and re-issue the access cookie
  @Post()
  async createOrganization(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrganizationDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponse> {
    await this.organizationsService.createOrganization(user.id, dto.name);

    const updatedUser = await this.usersService.findById(user.id);
    if (!updatedUser) {
      throw new InternalServerErrorException(
        'User not found after creating organization',
      );
    }

    const { accessToken } = this.accessTokensService.sign(updatedUser);
    this.cookiesService.setAccessCookie(response, accessToken);

    return { success: true };
  }

  // Switch active org (re-issue access token cookie with orgId claim)
  @Post(':id/switch')
  async switchOrganization(
    @CurrentUser() user: AuthUser,
    @Param() params: SwitchOrganizationParamsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: true }> {
    await this.organizationMembershipsService.setActiveOrganization(
      user.id,
      params.id,
    );

    // Fetch user and re-issue access cookie for new active org
    const updatedUser = await this.usersService.findById(user.id);
    if (!updatedUser) throw new Error('User not found after switch');

    const { accessToken } = this.accessTokensService.sign(updatedUser);
    this.cookiesService.setAccessCookie(response, accessToken);

    return { success: true };
  }

  // INVITES
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

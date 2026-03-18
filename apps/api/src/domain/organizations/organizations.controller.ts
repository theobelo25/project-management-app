import {
  Body,
  Controller,
  Delete,
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
  OrganizationDetailView,
  OrganizationInviteView,
  OrganizationMemberView,
  PendingInviteView,
  SuccessResponse,
  UserView,
} from '@repo/types';
import { OrganizationInvitesService } from './organization-invites.service';
import {
  AcceptOrganizationInviteDto,
  CreateOrganizationInviteDto,
  AddOrganizationMemberDto,
  OrganizationParamsDto,
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

  private async refreshAccessCookie(
    userId: string,
    response: Response,
    errorMessage: string,
  ) {
    const updatedUser = await this.usersService.findById(userId);
    if (!updatedUser) {
      throw new InternalServerErrorException(errorMessage);
    }

    const { accessToken } = this.accessTokensService.sign(updatedUser);
    this.cookiesService.setAccessCookie(response, accessToken);
  }

  @Get()
  async listMyOrganizations(@CurrentUser() user: AuthUser) {
    return this.organizationMembershipsService.listOrganizationsForUser(
      user.id,
    );
  }

  @Get(':id')
  async getOrganizationDetails(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
  ): Promise<OrganizationDetailView> {
    return this.organizationMembershipsService.getOrganizationDetails(
      user.id,
      params.id,
    );
  }

  @Post()
  async createOrganization(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrganizationDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponse> {
    await this.organizationsService.createOrganization(user.id, dto.name);
    await this.refreshAccessCookie(
      user.id,
      response,
      'User not found after creating organization',
    );

    return { success: true };
  }

  @Post(':id/members')
  async addOrganizationMember(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
    @Body() body: AddOrganizationMemberDto,
  ): Promise<OrganizationMemberView> {
    return this.organizationMembershipsService.addMember(
      user.id,
      params.id,
      body.userId,
    );
  }

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
    await this.refreshAccessCookie(
      user.id,
      response,
      'User not found after switch',
    );

    return { success: true };
  }

  @Post(':id/leave')
  async leaveOrganization(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: true }> {
    await this.organizationsService.leaveOrganization(user.id, params.id);
    await this.refreshAccessCookie(
      user.id,
      response,
      'User not found after leaving organization',
    );

    return { success: true };
  }

  @Delete(':id')
  async deleteOrganization(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: true }> {
    await this.organizationsService.deleteOrganization(user.id, params.id);
    await this.refreshAccessCookie(
      user.id,
      response,
      'User not found after deleting organization',
    );

    return { success: true };
  }

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

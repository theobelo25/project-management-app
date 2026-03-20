import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@api/common';
import {
  AuthUser,
  OrganizationDetailView,
  OrganizationInviteAdminView,
  OrganizationInviteView,
  OrganizationMemberView,
  OrganizationSummaryView,
  PaginatedOrganizationMembersView,
  PendingInviteView,
} from '@repo/types';
import { OrganizationInvitesService } from './services/organization-invites.service';
import {
  AcceptOrganizationInviteDto,
  CreateOrganizationInviteDto,
  AddOrganizationMemberDto,
  CreateOrganizationDto,
  OrganizationParamsDto,
  SwitchOrganizationParamsDto,
  InviteIdParamsDto,
  OrganizationMemberParamsDto,
  UpdateOrganizationMemberRoleDto,
} from './dto';
import { OrganizationMembershipsService } from './services/organization-memberships.service';
import { OrganizationsApplicationService } from './services/organizations-app.service';
import { RefreshOrganizationsAccessCookie } from './decorators/refresh-organizations-access-cookie.decorator';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(
    private readonly organizationsAppService: OrganizationsApplicationService,
    private readonly organizationMembershipsService: OrganizationMembershipsService,
    private readonly organizationInvitesService: OrganizationInvitesService,
  ) {}

  @Get()
  async listMyOrganizations(@CurrentUser() user: AuthUser) {
    return this.organizationMembershipsService.listOrganizationsForUser(
      user.id,
    );
  }

  // ---- Invites ----

  @Post('invites')
  async createInvite(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrganizationInviteDto,
  ): Promise<OrganizationInviteView> {
    return this.organizationInvitesService.createInvite(user, dto.email);
  }

  // New: list invites created for the current org (admin/owner)
  @Get('invites/sent')
  async listSentInvites(
    @CurrentUser() user: AuthUser,
  ): Promise<OrganizationInviteAdminView[]> {
    return this.organizationInvitesService.listInvitesForOrg(user);
  }

  // Existing: invites pending for the current user email
  @Get('invites')
  async getPendingInvites(
    @CurrentUser() user: AuthUser,
  ): Promise<PendingInviteView[]> {
    return this.organizationInvitesService.getPendingInvitesForUser(user.id);
  }

  // Existing: accept by token
  @RefreshOrganizationsAccessCookie()
  @Post('invites/accept')
  @HttpCode(204)
  async acceptInvite(
    @CurrentUser() user: AuthUser,
    @Body() dto: AcceptOrganizationInviteDto,
  ): Promise<void> {
    await this.organizationInvitesService.acceptInvite(user.id, dto.token);
  }

  // Existing: accept by id
  @RefreshOrganizationsAccessCookie()
  @Post('invites/:id/accept')
  @HttpCode(204)
  async acceptInviteById(
    @CurrentUser() user: AuthUser,
    @Param() params: InviteIdParamsDto,
  ): Promise<void> {
    await this.organizationInvitesService.acceptInviteById(user.id, params.id);
  }

  // Existing: decline by id
  @Post('invites/:id/decline')
  @HttpCode(204)
  async declineInviteById(
    @CurrentUser() user: AuthUser,
    @Param() params: InviteIdParamsDto,
  ): Promise<void> {
    await this.organizationInvitesService.declineInviteById(user.id, params.id);
  }

  // New: revoke invite by id (admin/owner)
  @Post('invites/:id/revoke')
  @HttpCode(204)
  async revokeInviteById(
    @CurrentUser() user: AuthUser,
    @Param() params: InviteIdParamsDto,
  ): Promise<void> {
    await this.organizationInvitesService.revokeInvite(user, params.id);
  }

  // ---- Orgs ----

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

  // New: summary endpoint (no members list)
  @Get(':id/summary')
  async getOrganizationSummary(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
  ): Promise<OrganizationSummaryView> {
    return this.organizationMembershipsService.getOrganizationSummary(
      user.id,
      params.id,
    );
  }

  // New: members list paginated
  @Get(':id/members')
  async listMembers(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ): Promise<PaginatedOrganizationMembersView> {
    // Keep it simple: coerce in controller (matches your PaginationQuerySchema defaults if you prefer DTO)
    const page = Math.max(1, Number(pageRaw ?? 1) || 1);
    const limit = Math.max(1, Math.min(100, Number(limitRaw ?? 20) || 20));

    // membership check is effectively enforced by repo/service behavior,
    // but if you want explicit auth, call assertMembership(user.id, params.id) first.
    await this.organizationMembershipsService.assertMembership(
      user.id,
      params.id,
    );

    return this.organizationMembershipsService.listMembers(
      params.id,
      page,
      limit,
    );
  }

  @RefreshOrganizationsAccessCookie()
  @Post()
  @HttpCode(204)
  async createOrganization(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrganizationDto,
  ): Promise<void> {
    await this.organizationsAppService.createOrganization(user, dto);
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

  // New: remove member
  @Delete(':id/members/:memberId')
  @HttpCode(204)
  async removeMember(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationMemberParamsDto,
  ): Promise<void> {
    await this.organizationMembershipsService.removeMember(
      user.id,
      params.id,
      params.memberId,
    );
  }

  // New: change member role
  @Patch(':id/members/:memberId/role')
  @HttpCode(204)
  async updateMemberRole(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationMemberParamsDto,
    @Body() body: UpdateOrganizationMemberRoleDto,
  ): Promise<void> {
    await this.organizationMembershipsService.updateMemberRole(
      user.id,
      params.id,
      params.memberId,
      body.role,
    );
  }

  @RefreshOrganizationsAccessCookie()
  @Post(':id/switch')
  @HttpCode(204)
  async switchOrganization(
    @CurrentUser() user: AuthUser,
    @Param() params: SwitchOrganizationParamsDto,
  ): Promise<void> {
    await this.organizationsAppService.switchOrganization(user, params);
  }

  @RefreshOrganizationsAccessCookie()
  @Post(':id/leave')
  @HttpCode(204)
  async leaveOrganization(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
  ): Promise<void> {
    await this.organizationsAppService.leaveOrganization(user, params);
  }

  @RefreshOrganizationsAccessCookie()
  @Delete(':id')
  @HttpCode(204)
  async deleteOrganization(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
  ): Promise<void> {
    await this.organizationsAppService.deleteOrganization(user, params);
  }
}

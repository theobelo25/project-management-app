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
} from '@nestjs/common';
import { CurrentUser, PaginationQueryDto } from '@api/common';
import {
  AuthUser,
  OrganizationDetailView,
  OrganizationInviteAdminView,
  OrganizationInviteView,
  OrganizationMemberView,
  OrganizationView,
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
import { Throttle } from '@nestjs/throttler';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  OrganizationDetailResponseDto,
  OrganizationInviteAdminListResponseDto,
  OrganizationInviteResponseDto,
  OrganizationMemberResponseDto,
  OrganizationSummaryResponseDto,
  OrganizationViewListResponseDto,
  PaginatedOrganizationMembersResponseDto,
  PendingInviteListResponseDto,
} from '@api/common/swagger/response-dtos';

@Controller('organizations')
@ApiTags('organizations')
@ApiCookieAuth('Authentication')
export class OrganizationsController {
  constructor(
    private readonly organizationsAppService: OrganizationsApplicationService,
    private readonly organizationMembershipsService: OrganizationMembershipsService,
    private readonly organizationInvitesService: OrganizationInvitesService,
  ) {}

  @Get()
  @ZodSerializerDto(OrganizationViewListResponseDto)
  async listMyOrganizations(
    @CurrentUser() user: AuthUser,
  ): Promise<OrganizationView[]> {
    return this.organizationMembershipsService.listOrganizationsForUser(
      user.id,
    );
  }

  // ---- Invites ----

  @Post('invites')
  @Throttle({ global: { ttl: 60_000, limit: 30 } })
  @ZodSerializerDto(OrganizationInviteResponseDto)
  async createInvite(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrganizationInviteDto,
  ): Promise<OrganizationInviteView> {
    return this.organizationInvitesService.createInvite(user, dto.email);
  }

  @Get('invites/sent')
  @Throttle({ global: { ttl: 60_000, limit: 60 } })
  @ZodSerializerDto(OrganizationInviteAdminListResponseDto)
  async listSentInvites(
    @CurrentUser() user: AuthUser,
  ): Promise<OrganizationInviteAdminView[]> {
    return this.organizationInvitesService.listInvitesForOrg(user);
  }

  @Get('invites')
  @Throttle({ global: { ttl: 60_000, limit: 60 } })
  @ZodSerializerDto(PendingInviteListResponseDto)
  async getPendingInvites(
    @CurrentUser() user: AuthUser,
  ): Promise<PendingInviteView[]> {
    return this.organizationInvitesService.getPendingInvitesForUser(user.id);
  }

  @RefreshOrganizationsAccessCookie()
  @Post('invites/accept')
  @HttpCode(204)
  @Throttle({ global: { ttl: 60_000, limit: 10 } })
  async acceptInvite(
    @CurrentUser() user: AuthUser,
    @Body() dto: AcceptOrganizationInviteDto,
  ): Promise<void> {
    await this.organizationInvitesService.acceptInvite(user.id, dto.token);
  }

  @RefreshOrganizationsAccessCookie()
  @Post('invites/:id/accept')
  @HttpCode(204)
  @Throttle({ global: { ttl: 60_000, limit: 10 } })
  async acceptInviteById(
    @CurrentUser() user: AuthUser,
    @Param() params: InviteIdParamsDto,
  ): Promise<void> {
    await this.organizationInvitesService.acceptInviteById(user.id, params.id);
  }

  @Post('invites/:id/decline')
  @HttpCode(204)
  @Throttle({ global: { ttl: 60_000, limit: 10 } })
  async declineInviteById(
    @CurrentUser() user: AuthUser,
    @Param() params: InviteIdParamsDto,
  ): Promise<void> {
    await this.organizationInvitesService.declineInviteById(user.id, params.id);
  }

  @Post('invites/:id/revoke')
  @HttpCode(204)
  @Throttle({ global: { ttl: 60_000, limit: 10 } })
  async revokeInviteById(
    @CurrentUser() user: AuthUser,
    @Param() params: InviteIdParamsDto,
  ): Promise<void> {
    await this.organizationInvitesService.revokeInvite(user, params.id);
  }

  // ---- Orgs ----

  @Get(':id')
  @ZodSerializerDto(OrganizationDetailResponseDto)
  async getOrganizationDetails(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
  ): Promise<OrganizationDetailView> {
    return this.organizationMembershipsService.getOrganizationDetails(
      user.id,
      params.id,
    );
  }

  @Get(':id/summary')
  @ZodSerializerDto(OrganizationSummaryResponseDto)
  async getOrganizationSummary(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
  ): Promise<OrganizationSummaryView> {
    return this.organizationMembershipsService.getOrganizationSummary(
      user.id,
      params.id,
    );
  }

  @Get(':id/members')
  @ZodSerializerDto(PaginatedOrganizationMembersResponseDto)
  async listMembers(
    @CurrentUser() user: AuthUser,
    @Param() params: OrganizationParamsDto,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedOrganizationMembersView> {
    await this.organizationMembershipsService.assertMembership(
      user.id,
      params.id,
    );

    return this.organizationMembershipsService.listMembers(params.id, query);
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
  @ZodSerializerDto(OrganizationMemberResponseDto)
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

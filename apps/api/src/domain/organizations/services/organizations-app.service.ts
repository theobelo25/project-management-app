import { Injectable } from '@nestjs/common';
import { AuthUser, SuccessResponse } from '@repo/types';

import { OrganizationsDomainService } from '../organizations.service';
import { OrganizationMembershipsService } from './organization-memberships.service';

import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { SwitchOrganizationParamsDto } from '../dto/switch-organization-params.dto';
import { OrganizationParamsDto } from '../dto/organization-params.dto';

@Injectable()
export class OrganizationsApplicationService {
  constructor(
    private readonly organizationsService: OrganizationsDomainService,
    private readonly organizationMembershipsService: OrganizationMembershipsService,
  ) {}

  async createOrganization(
    user: AuthUser,
    dto: CreateOrganizationDto,
  ): Promise<SuccessResponse> {
    await this.organizationsService.createOrganization(user.id, dto.name);
    return { success: true };
  }

  async switchOrganization(
    user: AuthUser,
    params: SwitchOrganizationParamsDto,
  ): Promise<SuccessResponse> {
    await this.organizationMembershipsService.setActiveOrganization(
      user.id,
      params.id,
    );
    return { success: true };
  }

  async leaveOrganization(
    user: AuthUser,
    params: OrganizationParamsDto,
  ): Promise<SuccessResponse> {
    await this.organizationsService.leaveOrganization(user.id, params.id);
    return { success: true };
  }

  async deleteOrganization(
    user: AuthUser,
    params: OrganizationParamsDto,
  ): Promise<SuccessResponse> {
    await this.organizationsService.deleteOrganization(user.id, params.id);
    return { success: true };
  }
}

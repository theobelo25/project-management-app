import { Injectable } from '@nestjs/common';
import { AuthUser } from '@repo/types';

import { OrganizationsDomainService } from './organizations-domain.service';
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
  ): Promise<void> {
    await this.organizationsService.createOrganization(user.id, dto.name);
  }

  async switchOrganization(
    user: AuthUser,
    params: SwitchOrganizationParamsDto,
  ): Promise<void> {
    await this.organizationMembershipsService.setActiveOrganization(
      user.id,
      params.id,
    );
  }

  async leaveOrganization(
    user: AuthUser,
    params: OrganizationParamsDto,
  ): Promise<void> {
    await this.organizationsService.leaveOrganization(user.id, params.id);
  }

  async deleteOrganization(
    user: AuthUser,
    params: OrganizationParamsDto,
  ): Promise<void> {
    await this.organizationsService.deleteOrganization(user.id, params.id);
  }
}

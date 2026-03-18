import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@api/domain/users/users.service';
import { OrganizationMembershipsService } from '../organizations/organization-memberships.service';
import { TokenPayload } from './types/token-payload.interface';
import { UserView } from '@repo/types';

@Injectable()
export class AuthorizedUserForOrgService {
  constructor(
    private readonly usersService: UsersService,
    private readonly organizationMembershipsService: OrganizationMembershipsService,
  ) {}

  async fromTokenPayload(payload: TokenPayload): Promise<UserView> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Unauthorized');

    const orgName =
      await this.organizationMembershipsService.getOrganizationNameForUser(
        user.id,
        payload.orgId,
      );

    if (!orgName) throw new UnauthorizedException('Unauthorized');

    return {
      ...user,
      orgId: payload.orgId,
      organizationName: orgName,
    };
  }
}

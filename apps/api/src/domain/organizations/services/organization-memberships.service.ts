import { Injectable } from '@nestjs/common';
import { OrganizationMembershipsQueriesService } from './organization-memberships-queries.service';
import { OrganizationMembershipsAuthorizationService } from './organization-memberships-authorization.service';
import { OrganizationMembershipsMutationsService } from './organization-memberships-mutations.service';
import { Db } from '@api/prisma';
import { OrganizationRole } from '@repo/types';

@Injectable()
export class OrganizationMembershipsService {
  constructor(
    private readonly queries: OrganizationMembershipsQueriesService,
    private readonly authorization: OrganizationMembershipsAuthorizationService,
    private readonly mutations: OrganizationMembershipsMutationsService,
  ) {}

  listOrganizationsForUser(userId: string, db?: Db) {
    return this.queries.listOrganizationsForUser(userId, db);
  }

  getOrganizationNameForUser(userId: string, organizationId: string, db?: Db) {
    return this.queries.getOrganizationNameForUser(userId, organizationId, db);
  }

  getOrganizationDetails(userId: string, organizationId: string, db?: Db) {
    return this.queries.getOrganizationDetails(userId, organizationId, db);
  }

  // New: summary without members list
  getOrganizationSummary(userId: string, organizationId: string, db?: Db) {
    return this.queries.getOrganizationSummary(userId, organizationId, db);
  }

  // New: paginated members list
  listMembers(organizationId: string, page: number, limit: number, db?: Db) {
    return this.queries.listMembers(organizationId, page, limit, db);
  }

  assertMembership(userId: string, organizationId: string, db?: Db) {
    return this.authorization.assertMembership(userId, organizationId, db);
  }

  setActiveOrganization(userId: string, organizationId: string, db?: Db) {
    return this.mutations.setActiveOrganization(userId, organizationId, db);
  }

  addMembershipIfMissing(
    userId: string,
    organizationId: string,
    role?: OrganizationRole,
    db?: Db,
  ) {
    return this.mutations.addMembershipIfMissing(
      userId,
      organizationId,
      role,
      db,
    );
  }

  addMember(
    actorUserId: string,
    organizationId: string,
    memberUserId: string,
    db?: Db,
  ) {
    return this.mutations.addMember(
      actorUserId,
      organizationId,
      memberUserId,
      db,
    );
  }

  // New: remove member
  removeMember(
    actorUserId: string,
    organizationId: string,
    memberUserId: string,
    db?: Db,
  ) {
    return this.mutations.removeMember(
      actorUserId,
      organizationId,
      memberUserId,
      db,
    );
  }

  // New: update member role
  updateMemberRole(
    actorUserId: string,
    organizationId: string,
    memberUserId: string,
    role: OrganizationRole,
    db?: Db,
  ) {
    return this.mutations.updateMemberRole(
      actorUserId,
      organizationId,
      memberUserId,
      role,
      db,
    );
  }
}

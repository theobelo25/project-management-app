import { Db } from '@api/prisma';
import {
  OrganizationDetailView,
  OrganizationMemberView,
  OrganizationRole,
  OrganizationView,
  PaginatedOrganizationMembersView,
  OrganizationSummaryView,
} from '@repo/types';
import type { PaginationQuery } from '@repo/types';

export abstract class OrganizationMembershipsRepository {
  abstract listOrganizationsForUser(
    userId: string,
    db?: Db,
  ): Promise<OrganizationView[]>;

  abstract getOrganizationNameForUser(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<string | null>;

  abstract getOrganizationDetailsForUser(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationDetailView | null>;

  // New: summary without members list
  abstract getOrganizationSummaryForUser(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationSummaryView | null>;

  abstract organizationExists(
    organizationId: string,
    db?: Db,
  ): Promise<boolean>;

  abstract findMembershipRole(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationRole | null>;

  abstract setActiveOrganization(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<void>;

  abstract addMembershipIfMissing(
    userId: string,
    organizationId: string,
    role: OrganizationRole,
    db?: Db,
  ): Promise<void>;

  abstract addMemberMembership(
    organizationId: string,
    memberUserId: string,
    role: OrganizationRole,
    db?: Db,
  ): Promise<OrganizationMemberView | null>;

  // New: member list with pagination
  abstract listMembersPaginated(
    organizationId: string,
    query: PaginationQuery,
    db?: Db,
  ): Promise<PaginatedOrganizationMembersView>;

  // New: owner safety helpers + mutations
  abstract countOwners(organizationId: string, db?: Db): Promise<number>;

  abstract removeMember(
    organizationId: string,
    memberUserId: string,
    db?: Db,
  ): Promise<void>;

  abstract updateMemberRole(
    organizationId: string,
    memberUserId: string,
    role: OrganizationRole,
    db?: Db,
  ): Promise<void>;

  // Orchestration helpers for OrganizationsDomainService

  abstract removeMembership(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<void>;

  abstract findAnotherOwner(
    organizationId: string,
    excludedUserId: string,
    db?: Db,
  ): Promise<boolean>;

  abstract findReassignmentOrganizationId(
    userId: string,
    excludedOrganizationId: string,
    preferredOrganizationId: string | null,
    db?: Db,
  ): Promise<string | null>;

  abstract findReassignmentOrganizationIdsForUsers(
    users: Array<{
      userId: string;
      preferredOrganizationId: string | null;
    }>,
    excludedOrganizationId: string,
    db?: Db,
  ): Promise<
    Array<{
      userId: string;
      reassignmentOrganizationId: string | null;
    }>
  >;
}

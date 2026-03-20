import { Db } from '@api/prisma';
import { PendingInviteView } from '@repo/types';
import {
  CreateOrganizationInviteInput,
  OrganizationInviteRecord,
} from '../types/organization-invite.repository.types';
import { OrganizationInviteAdminView } from '@repo/types';

export abstract class OrganizationInvitesRepository {
  abstract create(
    input: CreateOrganizationInviteInput,
    db?: Db,
  ): Promise<OrganizationInviteRecord>;

  abstract findByTokenHashAndPrefix(
    tokenHash: string,
    tokenPrefix: string,
    db?: Db,
  ): Promise<OrganizationInviteRecord | null>;

  abstract findById(
    inviteId: string,
    db?: Db,
  ): Promise<OrganizationInviteRecord | null>;

  abstract findPendingByEmail(
    email: string,
    db?: Db,
  ): Promise<PendingInviteView[]>;

  abstract listForOrganization(
    organizationId: string,
    db?: Db,
  ): Promise<OrganizationInviteAdminView[]>;

  abstract markAccepted(inviteId: string, now: Date, db?: Db): Promise<number>;

  abstract markRevoked(inviteId: string, now: Date, db?: Db): Promise<number>;
}

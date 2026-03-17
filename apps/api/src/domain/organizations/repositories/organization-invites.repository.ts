import { Db } from '@api/prisma';
import { PendingInviteView } from '@repo/types';
import {
  CreateOrganizationInviteInput,
  OrganizationInviteRecord,
} from '../types/organization-invite.repository.types';

export abstract class OrganizationInvitesRepository {
  abstract create(
    input: CreateOrganizationInviteInput,
    db?: Db,
  ): Promise<OrganizationInviteRecord>;

  abstract findByTokenHash(
    tokenHash: string,
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

  abstract markAccepted(inviteId: string, db?: Db): Promise<void>;

  abstract markRevoked(inviteId: string, db?: Db): Promise<void>;
}

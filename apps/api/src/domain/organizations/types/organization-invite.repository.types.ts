export type CreateOrganizationInviteInput = {
  organizationId: string;
  email: string;
  tokenHash: string;
  tokenPrefix: string;
  expiresAt: Date;
  createdById: string;
};

export type OrganizationInviteRecord = {
  id: string;
  organizationId: string;
  email: string;
  tokenPrefix: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
  createdById: string;
  createdAt: Date;
};

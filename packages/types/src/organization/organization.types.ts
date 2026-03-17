export type CreateOrganizationInviteDto = {
  email: string;
};

export type OrganizationInviteView = {
  inviteUrl: string;
  email: string;
  expiresAt: string; // ISO date string
};

export type AcceptOrganizationInviteDto = {
  token: string;
};

export type PendingInviteView = {
  id: string;
  organizationName: string;
  email: string;
  expiresAt: string; // ISO date string
};

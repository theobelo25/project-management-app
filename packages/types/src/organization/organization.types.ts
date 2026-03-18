export type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER";

export type CreateOrganizationDto = {
  name: string;
};

export type CreateOrganizationInviteDto = {
  email: string;
};

export type AddOrganizationMemberDto = {
  userId: string;
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

export type OrganizationView = {
  id: string;
  name: string;
  role: OrganizationRole;
  joinedAt: string; // ISO date string
};

export type OrganizationMemberView = {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  joinedAt: string; // ISO date string
};

export type OrganizationDetailView = {
  id: string;
  name: string;
  role: OrganizationRole;
  joinedAt: string; // ISO date string
  members: OrganizationMemberView[];
};

export type ListOrganizationsResponse = OrganizationView[];

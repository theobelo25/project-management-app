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

export type UpdateOrganizationMemberRoleDto = {
  role: OrganizationRole;
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

export type OrganizationInviteAdminView = {
  id: string;
  email: string;
  createdAt: string; // ISO date string
  expiresAt: string; // ISO date string
  acceptedAt: string | null; // ISO date string
  revokedAt: string | null; // ISO date string
  createdById: string;
};

export type OrganizationInvitesAdminListView = {
  items: OrganizationInviteAdminView[];
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

export type PaginatedOrganizationMembersView = {
  items: OrganizationMemberView[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type OrganizationDetailView = {
  id: string;
  name: string;
  role: OrganizationRole;
  joinedAt: string; // ISO date string
  members: OrganizationMemberView[];
};

export type OrganizationSummaryView = {
  id: string;
  name: string;
  role: OrganizationRole;
  joinedAt: string; // ISO date string
};

export type ListOrganizationsResponse = OrganizationView[];

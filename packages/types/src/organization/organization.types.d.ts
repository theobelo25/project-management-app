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
    expiresAt: string;
};
export type AcceptOrganizationInviteDto = {
    token: string;
};
export type PendingInviteView = {
    id: string;
    organizationName: string;
    email: string;
    expiresAt: string;
};
export type OrganizationInviteAdminView = {
    id: string;
    email: string;
    createdAt: string;
    expiresAt: string;
    acceptedAt: string | null;
    revokedAt: string | null;
    createdById: string;
};
export type OrganizationInvitesAdminListView = {
    items: OrganizationInviteAdminView[];
};
export type OrganizationView = {
    id: string;
    name: string;
    role: OrganizationRole;
    joinedAt: string;
};
export type OrganizationMemberView = {
    id: string;
    name: string;
    email: string;
    role: OrganizationRole;
    joinedAt: string;
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
    joinedAt: string;
    members: OrganizationMemberView[];
};
export type OrganizationSummaryView = {
    id: string;
    name: string;
    role: OrganizationRole;
    joinedAt: string;
};
export type ListOrganizationsResponse = OrganizationView[];

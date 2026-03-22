"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDetailViewSchema = exports.OrganizationSummaryViewSchema = exports.PaginatedOrganizationMembersViewSchema = exports.OrganizationMemberViewSchema = exports.OrganizationViewSchema = exports.OrganizationInvitesAdminListViewSchema = exports.PendingInviteViewSchema = exports.OrganizationInviteViewSchema = exports.OrganizationInviteAdminViewSchema = exports.UpdateOrganizationMemberRoleSchema = exports.OrganizationRoleSchema = exports.AddOrganizationMemberSchema = exports.AcceptOrganizationInviteSchema = exports.CreateOrganizationInviteSchema = exports.CreateOrganizationSchema = void 0;
const zod_1 = require("zod");
exports.CreateOrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Organization name is required"),
});
exports.CreateOrganizationInviteSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.AcceptOrganizationInviteSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
});
exports.AddOrganizationMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().trim().min(1, "User is required"),
});
exports.OrganizationRoleSchema = zod_1.z.enum(["OWNER", "ADMIN", "MEMBER"]);
exports.UpdateOrganizationMemberRoleSchema = zod_1.z.object({
    role: exports.OrganizationRoleSchema,
});
exports.OrganizationInviteAdminViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
    createdAt: zod_1.z.iso.datetime(),
    expiresAt: zod_1.z.iso.datetime(),
    acceptedAt: zod_1.z.iso.datetime().nullable(),
    revokedAt: zod_1.z.iso.datetime().nullable(),
    createdById: zod_1.z.string(),
});
exports.OrganizationInviteViewSchema = zod_1.z.object({
    inviteUrl: zod_1.z.string().url(),
    email: zod_1.z.string().email(),
    expiresAt: zod_1.z.iso.datetime(),
});
exports.PendingInviteViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    organizationName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    expiresAt: zod_1.z.iso.datetime(),
});
exports.OrganizationInvitesAdminListViewSchema = zod_1.z.object({
    items: zod_1.z.array(exports.OrganizationInviteAdminViewSchema),
});
exports.OrganizationViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    role: exports.OrganizationRoleSchema,
    joinedAt: zod_1.z.iso.datetime(),
});
exports.OrganizationMemberViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: exports.OrganizationRoleSchema,
    joinedAt: zod_1.z.iso.datetime(),
});
exports.PaginatedOrganizationMembersViewSchema = zod_1.z.object({
    items: zod_1.z.array(exports.OrganizationMemberViewSchema),
    page: zod_1.z.number().int().min(1),
    pageSize: zod_1.z.number().int().min(1),
    total: zod_1.z.number().int().min(0),
    totalPages: zod_1.z.number().int().min(0),
});
exports.OrganizationSummaryViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    role: exports.OrganizationRoleSchema,
    joinedAt: zod_1.z.iso.datetime(),
});
exports.OrganizationDetailViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    role: exports.OrganizationRoleSchema,
    joinedAt: zod_1.z.iso.datetime(),
    members: zod_1.z.array(exports.OrganizationMemberViewSchema),
});
//# sourceMappingURL=organization.schema.js.map
import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required"),
});

export const CreateOrganizationInviteSchema = z.object({
  email: z.string().email(),
});

export const AcceptOrganizationInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const AddOrganizationMemberSchema = z.object({
  userId: z.string().trim().min(1, "User is required"),
});

export const OrganizationRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER"]);

export const UpdateOrganizationMemberRoleSchema = z.object({
  role: OrganizationRoleSchema,
});

export const OrganizationInviteAdminViewSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.iso.datetime(),
  expiresAt: z.iso.datetime(),
  acceptedAt: z.iso.datetime().nullable(),
  revokedAt: z.iso.datetime().nullable(),
  createdById: z.string(),
});

export const OrganizationInvitesAdminListViewSchema = z.object({
  items: z.array(OrganizationInviteAdminViewSchema),
});

export const OrganizationMemberViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: OrganizationRoleSchema,
  joinedAt: z.iso.datetime(),
});

export const PaginatedOrganizationMembersViewSchema = z.object({
  items: z.array(OrganizationMemberViewSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export const OrganizationSummaryViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: OrganizationRoleSchema,
  joinedAt: z.iso.datetime(),
});

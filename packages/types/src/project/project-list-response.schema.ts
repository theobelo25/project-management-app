import { z } from "zod";
import { ProjectRoleSchema } from "./project-role.schema";

export const ProjectsListMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

export const ProjectListItemViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  ownerId: z.string(),
  archivedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  currentUserRole: ProjectRoleSchema.optional(),
  totalTasks: z.number().int().min(0),
  completedTasks: z.number().int().min(0),
  openTasks: z.number().int().min(0),
  members: z.array(ProjectsListMemberSchema),
});

export const PaginatedProjectsListViewSchema = z.object({
  items: z.array(ProjectListItemViewSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export type ProjectListMember = z.infer<typeof ProjectsListMemberSchema>;
export type ProjectListItemView = z.infer<typeof ProjectListItemViewSchema>;
export type PaginatedProjectsListView = z.infer<
  typeof PaginatedProjectsListViewSchema
>;

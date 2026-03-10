import { z } from "zod";
import { ProjectRoleSchema } from "./project-role.schema";

export const ProjectViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  ownerId: z.string(),
  archivedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  currentUserRole: ProjectRoleSchema.optional(),
});

export const PaginatedProjectsViewSchema = z.object({
  items: z.array(ProjectViewSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export type ProjectView = z.infer<typeof ProjectViewSchema>;
export type PaginatedProjectsView = z.infer<typeof PaginatedProjectsViewSchema>;

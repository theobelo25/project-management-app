import { z } from "zod";

const booleanish = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true");

export const ProjectsFilterSchema = z.enum([
  "all",
  "owned",
  "member",
  "archived",
]);
export type ProjectsFilter = z.infer<typeof ProjectsFilterSchema>;

export const ProjectsSortSchema = z.enum([
  "updated-desc",
  "created-desc",
  "name-asc",
]);
export type ProjectsSort = z.infer<typeof ProjectsSortSchema>;

export const GetProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  includeArchived: booleanish.optional().default(false),
  search: z
    .string()
    .optional()
    .transform((s) => (typeof s === "string" ? s.trim() || undefined : s)),
  filter: ProjectsFilterSchema.optional().default("all"),
  sort: ProjectsSortSchema.optional().default("updated-desc"),
});

export type GetProjectsQueryDto = z.infer<typeof GetProjectsQuerySchema>;

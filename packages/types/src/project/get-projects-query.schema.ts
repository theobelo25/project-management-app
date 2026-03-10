import { z } from "zod";

const booleanish = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true");

export const GetProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  includeArchived: booleanish.optional().default(false),
});

export type GetProjectsQueryDto = z.infer<typeof GetProjectsQuerySchema>;

import { z } from "zod";
export const GetUsersQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .transform((s) => (typeof s === "string" ? s.trim() || undefined : s)),
});
export type GetUsersQueryDto = z.infer<typeof GetUsersQuerySchema>;

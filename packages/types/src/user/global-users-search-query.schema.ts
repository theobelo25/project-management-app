import { z } from "zod";

/** Query for GET /users/search — must not allow full-directory dump. */
export const GlobalUsersSearchQuerySchema = z.object({
  search: z.preprocess((val) => {
    if (val === undefined || val === null) return "";
    return String(val).trim();
  }, z.string().min(2, "search must be at least 2 characters").max(100)),
});

export type GlobalUsersSearchQuery = z.infer<
  typeof GlobalUsersSearchQuerySchema
>;

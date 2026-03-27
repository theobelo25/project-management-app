import { z } from "zod";

/** Route param `{ id }` validated as UUID. */
export const UuidIdParamSchema = z.object({
  id: z.uuid(),
});

export type UuidIdParam = z.infer<typeof UuidIdParamSchema>;

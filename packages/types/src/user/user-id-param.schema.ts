import { z } from "zod";

export const UserIdParamSchema = z.object({
  id: z.uuid(),
});

import { z } from "zod";

export const ProjectIdParamSchema = z.object({
  id: z.uuid(),
});

export type ProjectIdParamDto = z.infer<typeof ProjectIdParamSchema>;

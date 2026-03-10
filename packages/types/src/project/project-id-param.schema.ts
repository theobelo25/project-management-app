import { z } from "zod";

export const ProjectIdParamSchema = z.object({
  id: z.string().trim().min(1, "Project id is required"),
});

export type ProjectIdParamDto = z.infer<typeof ProjectIdParamSchema>;

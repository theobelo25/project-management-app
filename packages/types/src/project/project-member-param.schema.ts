import { z } from "zod";

export const ProjectMemberParamSchema = z.object({
  id: z.string().trim().min(1, "Project id is required"),
  userId: z.string().trim().min(1, "User id is required"),
});

export type ProjectMemberParamDto = z.infer<typeof ProjectMemberParamSchema>;

import { z } from "zod";
import { ProjectRoleSchema } from "./project-role.schema";

export const AddProjectMemberSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
  role: ProjectRoleSchema.exclude(["OWNER"]).default("MEMBER"),
});

export type AddProjectMemberDto = z.infer<typeof AddProjectMemberSchema>;

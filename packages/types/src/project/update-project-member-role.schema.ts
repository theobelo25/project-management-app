import { z } from "zod";
import { ProjectRoleSchema } from "./project-role.schema";

export const UpdateProjectMemberRoleSchema = z.object({
  role: ProjectRoleSchema.exclude(["OWNER"]),
});

export type UpdateProjectMemberRoleDto = z.infer<
  typeof UpdateProjectMemberRoleSchema
>;

import { z } from "zod";
import { ProjectRoleSchema } from "./project-role.schema";

export const ProjectMemberViewSchema = z.object({
  userId: z.string(),
  role: ProjectRoleSchema,
  joinedAt: z.string().datetime(),
});

export const ProjectMembersViewSchema = z.object({
  items: z.array(ProjectMemberViewSchema),
});

export type ProjectMemberView = z.infer<typeof ProjectMemberViewSchema>;
export type ProjectMembersView = z.infer<typeof ProjectMembersViewSchema>;

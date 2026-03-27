import { z } from "zod";

export const ProjectRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER"]);

export type ProjectRole = z.infer<typeof ProjectRoleSchema>;

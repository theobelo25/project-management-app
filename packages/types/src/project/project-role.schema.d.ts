import { z } from "zod";
export declare const ProjectRoleSchema: z.ZodEnum<{
    OWNER: "OWNER";
    ADMIN: "ADMIN";
    MEMBER: "MEMBER";
}>;
export type ProjectRole = z.infer<typeof ProjectRoleSchema>;

import { z } from "zod";
export declare const UpdateProjectMemberRoleSchema: z.ZodObject<{
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>;
}, z.core.$strip>;
export type UpdateProjectMemberRoleDto = z.infer<typeof UpdateProjectMemberRoleSchema>;

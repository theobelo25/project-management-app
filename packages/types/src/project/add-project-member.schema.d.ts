import { z } from "zod";
export declare const AddProjectMemberSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>>;
}, z.core.$strip>;
export type AddProjectMemberDto = z.infer<typeof AddProjectMemberSchema>;

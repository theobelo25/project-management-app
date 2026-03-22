import { z } from "zod";
export declare const ProjectMemberViewSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>;
    joinedAt: z.ZodString;
}, z.core.$strip>;
export declare const ProjectMembersViewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        role: z.ZodEnum<{
            OWNER: "OWNER";
            ADMIN: "ADMIN";
            MEMBER: "MEMBER";
        }>;
        joinedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ProjectMemberView = z.infer<typeof ProjectMemberViewSchema>;
export type ProjectMembersView = z.infer<typeof ProjectMembersViewSchema>;

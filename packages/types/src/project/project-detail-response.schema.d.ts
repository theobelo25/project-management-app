import { z } from "zod";
export declare const ProjectDetailMemberSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodEmail>;
}, z.core.$strip>;
export declare const ProjectRecentTaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    status: z.ZodEnum<{
        TODO: "TODO";
        IN_PROGRESS: "IN_PROGRESS";
        REVIEW: "REVIEW";
        DONE: "DONE";
    }>;
}, z.core.$strip>;
export declare const ProjectDetailViewSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    ownerId: z.ZodString;
    archivedAt: z.ZodNullable<z.ZodISODateTime>;
    createdAt: z.ZodISODateTime;
    updatedAt: z.ZodISODateTime;
    currentUserRole: z.ZodOptional<z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>>;
    totalTasks: z.ZodNumber;
    completedTasks: z.ZodNumber;
    openTasks: z.ZodNumber;
    members: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        email: z.ZodOptional<z.ZodEmail>;
    }, z.core.$strip>>;
    recentTasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        status: z.ZodEnum<{
            TODO: "TODO";
            IN_PROGRESS: "IN_PROGRESS";
            REVIEW: "REVIEW";
            DONE: "DONE";
        }>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ProjectDetailMember = z.infer<typeof ProjectDetailMemberSchema>;
export type ProjectRecentTask = z.infer<typeof ProjectRecentTaskSchema>;
export type ProjectDetailView = z.infer<typeof ProjectDetailViewSchema>;

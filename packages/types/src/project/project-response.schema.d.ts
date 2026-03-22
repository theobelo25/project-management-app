import { z } from "zod";
export declare const ProjectViewSchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const PaginatedProjectsViewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>;
    page: z.ZodNumber;
    pageSize: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export type ProjectView = z.infer<typeof ProjectViewSchema>;
export type PaginatedProjectsView = z.infer<typeof PaginatedProjectsViewSchema>;

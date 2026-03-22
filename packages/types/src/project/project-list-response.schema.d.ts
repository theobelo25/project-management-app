import { z } from "zod";
export declare const ProjectsListMemberSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const ProjectListItemViewSchema: z.ZodObject<{
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
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const PaginatedProjectsListViewSchema: z.ZodObject<{
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
        totalTasks: z.ZodNumber;
        completedTasks: z.ZodNumber;
        openTasks: z.ZodNumber;
        members: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    page: z.ZodNumber;
    pageSize: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export type ProjectListMember = z.infer<typeof ProjectsListMemberSchema>;
export type ProjectListItemView = z.infer<typeof ProjectListItemViewSchema>;
export type PaginatedProjectsListView = z.infer<typeof PaginatedProjectsListViewSchema>;

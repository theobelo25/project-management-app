import { z } from "zod";
export declare const TaskAssigneeViewSchema: z.ZodObject<{
    userId: z.ZodString;
    assignedAt: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodEmail;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const TaskAssignmentViewSchema: z.ZodObject<{
    taskId: z.ZodUUID;
    userId: z.ZodUUID;
    assignedAt: z.ZodString;
}, z.core.$strip>;
export declare const TaskViewSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        TODO: "TODO";
        IN_PROGRESS: "IN_PROGRESS";
        REVIEW: "REVIEW";
        DONE: "DONE";
    }>;
    priority: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    dueDate: z.ZodNullable<z.ZodString>;
    position: z.ZodNumber;
    createdById: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    assignees: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        assignedAt: z.ZodString;
        user: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            email: z.ZodEmail;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const PaginatedTasksViewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            TODO: "TODO";
            IN_PROGRESS: "IN_PROGRESS";
            REVIEW: "REVIEW";
            DONE: "DONE";
        }>;
        priority: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
        }>;
        dueDate: z.ZodNullable<z.ZodString>;
        position: z.ZodNumber;
        createdById: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        assignees: z.ZodArray<z.ZodObject<{
            userId: z.ZodString;
            assignedAt: z.ZodString;
            user: z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                email: z.ZodEmail;
            }, z.core.$strip>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    page: z.ZodNumber;
    pageSize: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export type TaskView = z.infer<typeof TaskViewSchema>;
export type TaskAssigneeView = z.infer<typeof TaskAssigneeViewSchema>;
export type TaskAssignmentView = z.infer<typeof TaskAssignmentViewSchema>;
export type PaginatedTasksView = z.infer<typeof PaginatedTasksViewSchema>;

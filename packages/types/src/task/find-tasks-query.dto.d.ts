import { z } from "zod";
export declare const FindTasksQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    projectId: z.ZodUUID;
    status: z.ZodOptional<z.ZodEnum<{
        TODO: "TODO";
        IN_PROGRESS: "IN_PROGRESS";
        REVIEW: "REVIEW";
        DONE: "DONE";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>>;
    assigneeId: z.ZodOptional<z.ZodUUID>;
    search: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodEnum<{
        "updated-desc": "updated-desc";
        "created-desc": "created-desc";
        "title-asc": "title-asc";
        "status-asc": "status-asc";
    }>>;
}, z.core.$strip>;
export type FindTasksQuery = z.infer<typeof FindTasksQuerySchema>;

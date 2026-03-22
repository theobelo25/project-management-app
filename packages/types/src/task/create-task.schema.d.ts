import { z } from "zod";
export declare const CreateTaskSchema: z.ZodObject<{
    projectId: z.ZodUUID;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodISODateTime>>;
    position: z.ZodOptional<z.ZodNumber>;
    assigneeIds: z.ZodOptional<z.ZodArray<z.ZodUUID>>;
}, z.core.$strip>;
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

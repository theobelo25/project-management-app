import { z } from "zod";
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
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
    dueDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodString, z.ZodLiteral<"">]>>>, z.ZodTransform<Date | null | undefined, string | null | undefined>>>;
    position: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

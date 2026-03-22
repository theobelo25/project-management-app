import { z } from "zod";
export declare const TaskPrioritySchema: z.ZodEnum<{
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    HIGH: "HIGH";
}>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

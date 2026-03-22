import { z } from "zod";
export declare const TaskStatusSchema: z.ZodEnum<{
    TODO: "TODO";
    IN_PROGRESS: "IN_PROGRESS";
    REVIEW: "REVIEW";
    DONE: "DONE";
}>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

import { z } from "zod";
export declare const TaskAssigneeParamsSchema: z.ZodObject<{
    taskId: z.ZodUUID;
    userId: z.ZodUUID;
}, z.core.$strip>;
export type TaskAssigneeParams = z.infer<typeof TaskAssigneeParamsSchema>;

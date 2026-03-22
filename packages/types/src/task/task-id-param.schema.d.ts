import { z } from "zod";
export declare const TaskIdParamSchema: z.ZodObject<{
    taskId: z.ZodUUID;
}, z.core.$strip>;
export type TaskIdParam = z.infer<typeof TaskIdParamSchema>;

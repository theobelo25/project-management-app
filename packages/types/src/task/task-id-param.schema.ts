import { z } from "zod";

export const TaskIdParamSchema = z.object({
  taskId: z.uuid(),
});

export type TaskIdParam = z.infer<typeof TaskIdParamSchema>;

import { z } from "zod";

export const TaskAssigneeParamsSchema = z.object({
  taskId: z.uuid(),
  userId: z.uuid(),
});

export type TaskAssigneeParams = z.infer<typeof TaskAssigneeParamsSchema>;

import { z } from "zod";
import { TaskStatusSchema } from "./task-status.schema";
import { TaskPrioritySchema } from "./task-priority.schema";

export const CreateTaskSchema = z.object({
  projectId: z.uuid(),

  title: z.string().min(1, "Title is required").max(255),

  description: z.string().max(5000).nullable().optional(),

  status: TaskStatusSchema.optional(),

  priority: TaskPrioritySchema.optional(),

  dueDate: z.iso.datetime().optional().nullable(),

  position: z.number().int().nonnegative().optional(),

  assigneeIds: z.array(z.uuid()).optional(),
});

import { z } from "zod";
import { TaskStatusSchema } from "./task-status.schema";
import { TaskPrioritySchema } from "./task-priority.schema";

export const UpdateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").max(255).optional(),

  description: z.string().trim().max(5000).nullable().optional(),

  status: TaskStatusSchema.optional(),

  priority: TaskPrioritySchema.optional(),

  dueDate: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .optional(),

  position: z.number().int().nonnegative().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

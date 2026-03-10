import { z } from "zod";
import { TaskPriority, TaskStatus } from "./task.enums";

export const CreateTaskSchema = z.object({
  projectId: z.uuid(),

  title: z.string().min(1, "Title is required").max(255),

  description: z.string().max(5000).nullable().optional(),

  status: z.enum(TaskStatus).optional(),

  priority: z.enum(TaskPriority).optional(),

  dueDate: z.iso.datetime().optional().nullable(),

  position: z.number().int().nonnegative().optional(),

  assigneeIds: z.array(z.uuid()).optional(),
});

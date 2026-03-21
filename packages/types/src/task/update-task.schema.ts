import { z } from "zod";
import { TaskStatusSchema } from "./task-status.schema";
import { TaskPrioritySchema } from "./task-priority.schema";

export const UpdateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").max(255).optional(),

  description: z.string().trim().max(5000).nullable().optional(),

  status: TaskStatusSchema.optional(),

  priority: TaskPrioritySchema.optional(),

  dueDate: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z
      .union([
        z.string().datetime(),
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        z.literal(""),
      ])
      .optional()
      .nullable()
      .transform((val) => {
        if (val === undefined) return undefined;
        if (val === null) return null;
        if (val === "") return null;

        const date = new Date(
          val.length === 10 ? `${val}T12:00:00.000Z` : val,
        );
        return Number.isNaN(date.getTime()) ? undefined : date;
      }),
  ),

  position: z.number().int().nonnegative().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

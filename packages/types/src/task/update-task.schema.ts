import { z } from "zod";
import { TaskStatusSchema } from "./task-status.schema";
import { TaskPrioritySchema } from "./task-priority.schema";

export const UpdateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").max(255).optional(),

  description: z.string().trim().max(5000).nullable().optional(),

  status: TaskStatusSchema.optional(),

  priority: TaskPrioritySchema.optional(),

  dueDate: z
    .union([
      z.string().datetime(),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      z.literal(""),
      z.coerce.date(), // accepts Date or string that can be parsed to Date
    ])
    .optional()
    .nullable()
    .transform((val) => {
      // IMPORTANT:
      // - `undefined` => omitted => "no change"
      // - `null` and `""` => explicit clear => mapper will set dueDate: null
      if (val === undefined) return undefined;
      if (val === null) return null;
      if (typeof val === "string" && val === "") return null;

      const date =
        val instanceof Date
          ? val
          : new Date(val.length === 10 ? `${val}T12:00:00.000Z` : val);

      return Number.isNaN(date.getTime()) ? undefined : date;
    }),

  position: z.number().int().nonnegative().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

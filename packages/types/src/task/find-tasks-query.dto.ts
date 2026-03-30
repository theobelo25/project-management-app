import { z } from "zod";
import { PaginationQuerySchema } from "../pagination/pagination.schema";
import { TaskLabelColorSchema } from "./task-label-color.schema";
import { TaskPrioritySchema } from "./task-priority.schema";
import { TaskStatusSchema } from "./task-status.schema";

export const FindTasksQuerySchema = PaginationQuerySchema.extend({
  projectId: z.uuid(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  labelColor: TaskLabelColorSchema.optional(),
  assigneeId: z.uuid().optional(),
  search: z.string().trim().min(1).optional(),
  sort: z
    .enum(["updated-desc", "created-desc", "title-asc", "status-asc"])
    .optional(),
});

export type FindTasksQuery = z.infer<typeof FindTasksQuerySchema>;

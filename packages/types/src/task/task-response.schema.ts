import { z } from "zod";
import { TaskStatusSchema } from "./task-status.schema";
import { TaskPrioritySchema } from "./task-priority.schema";

export const TaskAssigneeViewSchema = z.object({
  userId: z.string(),
  assignedAt: z.string().datetime(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
  }),
});

export const TaskAssignmentViewSchema = z.object({
  taskId: z.uuid(),
  userId: z.uuid(),
  assignedAt: z.string().datetime(),
});

export const TaskViewSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  dueDate: z.string().datetime().nullable(),
  position: z.number().int(),
  createdById: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  assignees: z.array(TaskAssigneeViewSchema),
});

export const PaginatedTasksViewSchema = z.object({
  items: z.array(TaskViewSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export type TaskView = z.infer<typeof TaskViewSchema>;
export type TaskAssigneeView = z.infer<typeof TaskAssigneeViewSchema>;
export type TaskAssignmentView = z.infer<typeof TaskAssignmentViewSchema>;
export type PaginatedTasksView = z.infer<typeof PaginatedTasksViewSchema>;

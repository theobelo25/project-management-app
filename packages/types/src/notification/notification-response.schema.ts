import { z } from "zod";

export const NotificationTypeSchema = z.enum([
  "task_assigned",
  "task_updated",
  "project_member_added",
  "project_member_removed",
  "project_member_role_changed",
]);

export const NotificationViewSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string().nullable().optional(),
  meta: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string().datetime(),
});

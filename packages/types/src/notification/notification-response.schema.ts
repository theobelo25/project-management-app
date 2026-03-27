import { z } from "zod";

export const NotificationTypeSchema = z.enum(["task_assigned"]);

export const NotificationViewSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string().nullable().optional(),
  meta: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string().datetime(),
});

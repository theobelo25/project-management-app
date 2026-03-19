import { z } from "zod";

export const NotificationIdParamSchema = z.object({
  id: z.uuid(),
});

export type NotificationIdParam = z.infer<typeof NotificationIdParamSchema>;

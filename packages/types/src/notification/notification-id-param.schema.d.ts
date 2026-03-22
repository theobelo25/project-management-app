import { z } from "zod";
export declare const NotificationIdParamSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export type NotificationIdParam = z.infer<typeof NotificationIdParamSchema>;

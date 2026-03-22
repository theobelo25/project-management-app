import { z } from "zod";
export declare const NotificationTypeSchema: z.ZodEnum<{
    task_assigned: "task_assigned";
}>;
export declare const NotificationViewSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        task_assigned: "task_assigned";
    }>;
    title: z.ZodString;
    body: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodString;
}, z.core.$strip>;

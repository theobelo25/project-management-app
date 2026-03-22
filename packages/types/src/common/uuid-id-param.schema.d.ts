import { z } from "zod";
export declare const UuidIdParamSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export type UuidIdParam = z.infer<typeof UuidIdParamSchema>;

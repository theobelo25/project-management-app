import { z } from "zod";
export declare const GlobalUsersSearchQuerySchema: z.ZodObject<{
    search: z.ZodPipe<z.ZodTransform<string, unknown>, z.ZodString>;
}, z.core.$strip>;
export type GlobalUsersSearchQuery = z.infer<typeof GlobalUsersSearchQuerySchema>;

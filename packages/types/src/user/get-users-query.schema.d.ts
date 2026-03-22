import { z } from "zod";
export declare const GetUsersQuerySchema: z.ZodObject<{
    search: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
}, z.core.$strip>;
export type GetUsersQueryDto = z.infer<typeof GetUsersQuerySchema>;

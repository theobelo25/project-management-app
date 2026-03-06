import { z } from "zod";
export declare const UpdateUserInputSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodEmail>;
    name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type UpdateUserInputDto = z.infer<typeof UpdateUserInputSchema>;

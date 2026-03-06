import { z } from "zod";
export declare const CreateUserInputSchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

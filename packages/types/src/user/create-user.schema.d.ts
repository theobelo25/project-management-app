import { z } from "zod";
export declare const CreateUserInputSchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodString;
    passwordHash: z.ZodString;
}, z.core.$strip>;
export type CreateUserInputDto = z.infer<typeof CreateUserInputSchema>;

import { z } from "zod";
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

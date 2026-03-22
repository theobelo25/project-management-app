import { z } from "zod";
export declare const SignupRequestSchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type SignupRequestDto = z.infer<typeof SignupRequestSchema>;

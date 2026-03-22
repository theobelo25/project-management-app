import { z } from "zod";
export declare const AuthSessionSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        organizationName: z.ZodString;
        email: z.ZodEmail;
        name: z.ZodString;
        createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodISODateTime>;
        updatedAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodISODateTime>;
    }, z.core.$strip>;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;

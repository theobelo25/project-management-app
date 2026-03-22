import { z } from "zod";
export declare const ProjectMemberParamSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
}, z.core.$strip>;
export type ProjectMemberParamDto = z.infer<typeof ProjectMemberParamSchema>;

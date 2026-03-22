import { z } from "zod";
export declare const ProjectIdParamSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export type ProjectIdParamDto = z.infer<typeof ProjectIdParamSchema>;

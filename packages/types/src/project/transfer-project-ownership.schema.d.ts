import { z } from "zod";
export declare const TransferProjectOwnershipSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export type TransferProjectOwnershipDto = z.infer<typeof TransferProjectOwnershipSchema>;

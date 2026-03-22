import { z } from "zod";
export declare const OrganizationParamsSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export declare const SwitchOrganizationParamsSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export declare const InviteIdParamsSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export declare const OrganizationMemberParamsSchema: z.ZodObject<{
    id: z.ZodUUID;
    memberId: z.ZodUUID;
}, z.core.$strip>;

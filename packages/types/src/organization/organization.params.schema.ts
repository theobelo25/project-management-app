import { z } from "zod";

export const OrganizationParamsSchema = z.object({
  id: z.uuid(),
});

export const SwitchOrganizationParamsSchema = z.object({
  id: z.uuid(),
});

export const OrganizationMemberParamsSchema = z.object({
  id: z.uuid(),
  memberId: z.uuid(),
});

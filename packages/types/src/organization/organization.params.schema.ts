import { z } from "zod";

import { UuidIdParamSchema } from "../common/uuid-id-param.schema";

export const OrganizationParamsSchema = UuidIdParamSchema;

export const SwitchOrganizationParamsSchema = UuidIdParamSchema;

/** Invite id in routes like `organizations/invites/:id/...`. */
export const InviteIdParamsSchema = UuidIdParamSchema;

export const OrganizationMemberParamsSchema = z.object({
  id: z.uuid(),
  memberId: z.uuid(),
});

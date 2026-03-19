import { createZodDto, OrganizationParamsSchema } from '@repo/types';

/** Semantic DTO for invite ID in routes like invites/:id/accept and invites/:id/decline. */
export class InviteIdParamsDto extends createZodDto(OrganizationParamsSchema) {}

import { OrganizationParamsSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

/** Semantic DTO for invite ID in routes like invites/:id/accept and invites/:id/decline. */
export class InviteIdParamsDto extends createZodDto(OrganizationParamsSchema) {}

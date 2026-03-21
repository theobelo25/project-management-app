import { CreateOrganizationInviteSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class CreateOrganizationInviteDto extends createZodDto(
  CreateOrganizationInviteSchema,
) {}

import { createZodDto } from '@api/common';
import { CreateOrganizationInviteSchema } from '@repo/types';

export class CreateOrganizationInviteDto extends createZodDto(
  CreateOrganizationInviteSchema,
) {}

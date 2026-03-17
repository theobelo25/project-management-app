import { createZodDto } from '@api/common';
import { AcceptOrganizationInviteSchema } from '@repo/types';

export class AcceptOrganizationInviteDto extends createZodDto(
  AcceptOrganizationInviteSchema,
) {}

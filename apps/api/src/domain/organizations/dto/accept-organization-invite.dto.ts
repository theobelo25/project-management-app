import { AcceptOrganizationInviteSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class AcceptOrganizationInviteDto extends createZodDto(
  AcceptOrganizationInviteSchema,
) {}

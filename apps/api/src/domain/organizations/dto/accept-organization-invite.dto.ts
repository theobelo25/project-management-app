import { AcceptOrganizationInviteSchema, createZodDto } from '@repo/types';

export class AcceptOrganizationInviteDto extends createZodDto(
  AcceptOrganizationInviteSchema,
) {}

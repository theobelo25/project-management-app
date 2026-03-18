import { CreateOrganizationInviteSchema, createZodDto } from '@repo/types';

export class CreateOrganizationInviteDto extends createZodDto(
  CreateOrganizationInviteSchema,
) {}

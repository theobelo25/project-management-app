import { AddOrganizationMemberSchema, createZodDto } from '@repo/types';

export class AddOrganizationMemberDto extends createZodDto(
  AddOrganizationMemberSchema,
) {}

import { createZodDto, UpdateOrganizationMemberRoleSchema } from '@repo/types';

export class UpdateOrganizationMemberRoleDto extends createZodDto(
  UpdateOrganizationMemberRoleSchema,
) {}

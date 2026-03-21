import { UpdateOrganizationMemberRoleSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class UpdateOrganizationMemberRoleDto extends createZodDto(
  UpdateOrganizationMemberRoleSchema,
) {}

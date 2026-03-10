import { UpdateProjectMemberRoleSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class UpdateProjectMemberRoleDto extends createZodDto(
  UpdateProjectMemberRoleSchema,
) {}

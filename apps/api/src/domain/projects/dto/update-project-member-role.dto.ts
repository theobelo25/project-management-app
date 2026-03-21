import { UpdateProjectMemberRoleSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class UpdateProjectMemberRoleDto extends createZodDto(
  UpdateProjectMemberRoleSchema,
) {}

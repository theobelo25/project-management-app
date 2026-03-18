import { UpdateProjectMemberRoleSchema, createZodDto } from '@repo/types';

export class UpdateProjectMemberRoleDto extends createZodDto(
  UpdateProjectMemberRoleSchema,
) {}

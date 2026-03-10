import { ProjectMemberParamSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class ProjectMemberParamDto extends createZodDto(
  ProjectMemberParamSchema,
) {}

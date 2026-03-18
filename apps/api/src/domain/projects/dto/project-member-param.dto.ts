import { ProjectMemberParamSchema, createZodDto } from '@repo/types';

export class ProjectMemberParamDto extends createZodDto(
  ProjectMemberParamSchema,
) {}

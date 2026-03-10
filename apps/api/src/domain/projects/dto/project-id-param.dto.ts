import { ProjectIdParamSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class ProjectIdParamDto extends createZodDto(ProjectIdParamSchema) {}

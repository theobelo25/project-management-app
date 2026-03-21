import { ProjectIdParamSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class ProjectIdParamDto extends createZodDto(ProjectIdParamSchema) {}

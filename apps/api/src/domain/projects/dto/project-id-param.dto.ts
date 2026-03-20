import { ProjectIdParamSchema, createZodDto } from '@repo/types';

export class ProjectIdParamDto extends createZodDto(ProjectIdParamSchema) {}

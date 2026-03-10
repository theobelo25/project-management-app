import { GetProjectsQuerySchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class GetProjectsQueryDto extends createZodDto(GetProjectsQuerySchema) {}

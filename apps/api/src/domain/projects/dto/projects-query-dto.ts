import { GetProjectsQuerySchema, createZodDto } from '@repo/types';

export class GetProjectsQueryDto extends createZodDto(GetProjectsQuerySchema) {}

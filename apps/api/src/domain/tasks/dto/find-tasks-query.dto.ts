import { FindTasksQuerySchema, createZodDto } from '@repo/types';

export class FindTasksQueryDto extends createZodDto(FindTasksQuerySchema) {}

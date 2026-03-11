import { FindTasksQuerySchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class FindTasksQueryDto extends createZodDto(FindTasksQuerySchema) {}

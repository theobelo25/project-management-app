import { FindTasksQuerySchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class FindTasksQueryDto extends createZodDto(FindTasksQuerySchema) {}

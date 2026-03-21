import { TaskIdParamSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class TaskIdParamDto extends createZodDto(TaskIdParamSchema) {}

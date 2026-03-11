import { TaskIdParamSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class TaskIdParamDto extends createZodDto(TaskIdParamSchema) {}

import { TaskIdParamSchema, createZodDto } from '@repo/types';

export class TaskIdParamDto extends createZodDto(TaskIdParamSchema) {}

import { TaskAssigneeParamsSchema, createZodDto } from '@repo/types';

export class TaskAssigneeParamsDto extends createZodDto(
  TaskAssigneeParamsSchema,
) {}

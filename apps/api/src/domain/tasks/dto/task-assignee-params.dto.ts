import { TaskAssigneeParamsSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class TaskAssigneeParamsDto extends createZodDto(
  TaskAssigneeParamsSchema,
) {}

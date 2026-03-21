import { TaskAssigneeParamsSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class TaskAssigneeParamsDto extends createZodDto(
  TaskAssigneeParamsSchema,
) {}

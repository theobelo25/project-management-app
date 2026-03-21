import { NotificationIdParamSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class NotificationIdParamDto extends createZodDto(
  NotificationIdParamSchema,
) {}

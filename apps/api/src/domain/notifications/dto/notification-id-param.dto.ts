import { NotificationIdParamSchema, createZodDto } from '@repo/types';

export class NotificationIdParamDto extends createZodDto(
  NotificationIdParamSchema,
) {}

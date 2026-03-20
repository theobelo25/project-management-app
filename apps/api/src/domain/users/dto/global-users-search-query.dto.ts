import { GlobalUsersSearchQuerySchema, createZodDto } from '@repo/types';

export class GlobalUsersSearchQueryDto extends createZodDto(
  GlobalUsersSearchQuerySchema,
) {}

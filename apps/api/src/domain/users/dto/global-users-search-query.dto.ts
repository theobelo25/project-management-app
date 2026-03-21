import { GlobalUsersSearchQuerySchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class GlobalUsersSearchQueryDto extends createZodDto(
  GlobalUsersSearchQuerySchema,
) {}

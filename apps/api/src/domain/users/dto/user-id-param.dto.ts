import { UserIdParamSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class UserIdParamDto extends createZodDto(UserIdParamSchema) {}

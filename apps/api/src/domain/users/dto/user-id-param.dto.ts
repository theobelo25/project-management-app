import { createZodDto, UserIdParamSchema } from '@repo/types';

export class UserIdParamDto extends createZodDto(UserIdParamSchema) {}

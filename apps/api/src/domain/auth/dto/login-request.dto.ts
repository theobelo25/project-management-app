import { LoginRequestSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

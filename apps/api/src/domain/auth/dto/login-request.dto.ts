import { createZodDto } from '@api/common';
import { LoginRequestSchema } from '@repo/types';

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

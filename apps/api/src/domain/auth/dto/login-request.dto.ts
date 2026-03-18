import { LoginRequestSchema, createZodDto } from '@repo/types';

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

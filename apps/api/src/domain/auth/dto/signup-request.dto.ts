import { SignupRequestSchema, createZodDto } from '@repo/types';

export class SignupRequestDto extends createZodDto(SignupRequestSchema) {}

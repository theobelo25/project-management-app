import { createZodDto } from '@api/common';
import { SignupRequestSchema } from '@repo/types';

export class SignupRequestDto extends createZodDto(SignupRequestSchema) {}

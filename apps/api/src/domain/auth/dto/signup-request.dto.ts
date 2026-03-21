import { SignupRequestSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class SignupRequestDto extends createZodDto(SignupRequestSchema) {}

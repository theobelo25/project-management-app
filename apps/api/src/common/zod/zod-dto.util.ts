import type { ZodType } from 'zod';
import { createZodDto as createNestZodDto } from 'nestjs-zod';
import type { ZodDtoClass } from '@repo/types';

export function createZodDto<TOutput extends object>(
  schema: ZodType<TOutput>,
): ZodDtoClass<TOutput> {
  return createNestZodDto(schema) as unknown as ZodDtoClass<TOutput>;
}

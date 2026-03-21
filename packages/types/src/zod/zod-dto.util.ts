import type { ZodType } from 'zod';

export type ZodDtoClass<TOutput extends object = object> = {
  new (): TOutput;
  schema: ZodType<TOutput>;
};

export function isZodDto(metatype: unknown): metatype is ZodDtoClass {
  return Boolean(
    metatype &&
      (typeof metatype === 'object' || typeof metatype === 'function') &&
      'isZodDto' in metatype &&
      (metatype as { isZodDto?: unknown }).isZodDto === true,
  );
}

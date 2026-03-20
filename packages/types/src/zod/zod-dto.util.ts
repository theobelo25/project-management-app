import type { ZodType } from "zod";
import { createZodDto as createNestZodDto } from "nestjs-zod";

export type ZodDtoClass<TOutput extends object = object> = {
  new (): TOutput;
  schema: ZodType<TOutput>;
};

export function createZodDto<TOutput extends object>(
  schema: ZodType<TOutput>,
): ZodDtoClass<TOutput> {
  return createNestZodDto(schema) as unknown as ZodDtoClass<TOutput>;
}

export function isZodDto(metatype: unknown): metatype is ZodDtoClass {
  return Boolean(
    metatype &&
      (typeof metatype === "object" || typeof metatype === "function") &&
      "isZodDto" in metatype &&
      (metatype as { isZodDto?: unknown }).isZodDto === true,
  );
}

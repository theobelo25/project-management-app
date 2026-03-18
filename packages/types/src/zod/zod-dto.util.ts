import type { ZodType } from "zod";

export type ZodDtoClass<TOutput extends object = object> = {
  new (): TOutput;
  schema: ZodType<TOutput>;
};

export function createZodDto<TOutput extends object>(
  schema: ZodType<TOutput>,
): ZodDtoClass<TOutput> {
  abstract class ZodDto {
    static schema = schema;
  }
  return ZodDto as unknown as ZodDtoClass<TOutput>;
}

export function isZodDto(metatype: unknown): metatype is ZodDtoClass {
  return typeof metatype === "function" && "schema" in metatype;
}

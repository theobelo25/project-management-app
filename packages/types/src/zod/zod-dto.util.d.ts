import type { ZodType } from 'zod';
export type ZodDtoClass<TOutput extends object = object> = {
    new (): TOutput;
    schema: ZodType<TOutput>;
};
export declare function isZodDto(metatype: unknown): metatype is ZodDtoClass;

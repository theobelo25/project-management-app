import { ZodType } from 'zod';
type ZodDtoClass<TOutput extends object = object> = {
    new (): TOutput;
    schema: ZodType<TOutput>;
};
export declare function createZodDto<TOutput extends object>(schema: ZodType<TOutput>): ZodDtoClass<TOutput>;
export declare function isZodDto(metatype: unknown): metatype is ZodDtoClass;
export {};

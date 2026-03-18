import { PaginationQuerySchema, createZodDto } from '@repo/types';

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

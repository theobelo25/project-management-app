import { PaginationQuerySchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

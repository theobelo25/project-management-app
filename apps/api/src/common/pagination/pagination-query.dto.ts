import { PaginationQuerySchema } from '@repo/types';
import { createZodDto } from '../zod/zod-dto.util';

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

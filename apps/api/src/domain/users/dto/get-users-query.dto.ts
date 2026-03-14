import { createZodDto } from '@api/common';
import { GetUsersQuerySchema } from '@repo/types';

export class GetUsersQueryDto extends createZodDto(GetUsersQuerySchema) {}

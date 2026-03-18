import { GetUsersQuerySchema, createZodDto } from '@repo/types';

export class GetUsersQueryDto extends createZodDto(GetUsersQuerySchema) {}

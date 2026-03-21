import { GetProjectsQuerySchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class GetProjectsQueryDto extends createZodDto(GetProjectsQuerySchema) {}

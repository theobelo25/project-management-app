import { CreateProjectSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}

import { CreateTaskSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

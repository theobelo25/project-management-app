import { UpdateTaskSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}

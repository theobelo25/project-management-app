import { UpdateTaskSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}

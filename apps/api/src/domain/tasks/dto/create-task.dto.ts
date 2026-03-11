import { CreateTaskSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

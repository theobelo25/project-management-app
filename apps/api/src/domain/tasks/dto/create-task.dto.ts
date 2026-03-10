import { CreateTaskSchema } from 'packages/types/dist';
import { createZodDto } from '@api/common';

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

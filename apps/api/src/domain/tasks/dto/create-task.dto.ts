import { CreateTaskSchema, createZodDto } from '@repo/types';

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

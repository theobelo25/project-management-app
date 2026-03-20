import { UpdateTaskSchema, createZodDto } from '@repo/types';

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}

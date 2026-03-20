import { CreateProjectSchema, createZodDto } from '@repo/types';

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}

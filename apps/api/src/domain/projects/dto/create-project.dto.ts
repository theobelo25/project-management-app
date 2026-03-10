import { CreateProjectSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}

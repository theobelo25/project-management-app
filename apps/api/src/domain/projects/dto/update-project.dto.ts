import { UpdateProjectSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}

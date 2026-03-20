import { UpdateProjectSchema, createZodDto } from '@repo/types';

export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}

import { UpdateProjectSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}

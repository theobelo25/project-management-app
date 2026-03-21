import { CreateOrganizationSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class CreateOrganizationDto extends createZodDto(
  CreateOrganizationSchema,
) {}

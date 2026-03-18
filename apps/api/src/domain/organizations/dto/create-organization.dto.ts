import { createZodDto } from '@api/common';
import { CreateOrganizationSchema } from '@repo/types';

export class CreateOrganizationDto extends createZodDto(
  CreateOrganizationSchema,
) {}

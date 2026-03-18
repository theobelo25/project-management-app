import { createZodDto, OrganizationParamsSchema } from '@repo/types';

export class OrganizationParamsDto extends createZodDto(
  OrganizationParamsSchema,
) {}

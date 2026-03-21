import { OrganizationParamsSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class OrganizationParamsDto extends createZodDto(
  OrganizationParamsSchema,
) {}

import { SwitchOrganizationParamsSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class SwitchOrganizationParamsDto extends createZodDto(
  SwitchOrganizationParamsSchema,
) {}

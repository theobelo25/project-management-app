import { createZodDto, SwitchOrganizationParamsSchema } from '@repo/types';

export class SwitchOrganizationParamsDto extends createZodDto(
  SwitchOrganizationParamsSchema,
) {}

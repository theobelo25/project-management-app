import { z } from 'zod';
import { createZodDto } from '@api/common';

const SwitchOrganizationParamsSchema = z.object({
  id: z.string().uuid(),
});

export class SwitchOrganizationParamsDto extends createZodDto(
  SwitchOrganizationParamsSchema,
) {}

import { OrganizationMemberParamsSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class OrganizationMemberParamsDto extends createZodDto(
  OrganizationMemberParamsSchema,
) {}

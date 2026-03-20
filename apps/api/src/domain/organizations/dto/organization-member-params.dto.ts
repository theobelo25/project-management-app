import { createZodDto, OrganizationMemberParamsSchema } from '@repo/types';

export class OrganizationMemberParamsDto extends createZodDto(
  OrganizationMemberParamsSchema,
) {}

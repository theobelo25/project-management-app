import { AddOrganizationMemberSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class AddOrganizationMemberDto extends createZodDto(
  AddOrganizationMemberSchema,
) {}

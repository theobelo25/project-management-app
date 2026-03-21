import { AddProjectMemberSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class AddProjectMemberDto extends createZodDto(AddProjectMemberSchema) {}

import { AddProjectMemberSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class AddProjectMemberDto extends createZodDto(AddProjectMemberSchema) {}

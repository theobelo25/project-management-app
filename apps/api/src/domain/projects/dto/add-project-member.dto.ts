import { AddProjectMemberSchema, createZodDto } from '@repo/types';

export class AddProjectMemberDto extends createZodDto(AddProjectMemberSchema) {}

import { CreateOrganizationSchema, createZodDto } from '@repo/types';

export class CreateOrganizationDto extends createZodDto(
  CreateOrganizationSchema,
) {}

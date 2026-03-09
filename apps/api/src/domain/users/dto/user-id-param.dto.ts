import { z } from 'zod';
import { createZodDto } from '@api/common';

const UserIdParamSchema = z.object({
  id: z.string().uuid(),
});

export class UserIdParamDto extends createZodDto(UserIdParamSchema) {}

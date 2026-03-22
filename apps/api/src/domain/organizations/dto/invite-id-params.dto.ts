import { InviteIdParamsSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class InviteIdParamsDto extends createZodDto(InviteIdParamsSchema) {}

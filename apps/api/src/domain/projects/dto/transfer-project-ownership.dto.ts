import { TransferProjectOwnershipSchema } from '@repo/types';
import { createZodDto } from '@api/common/zod/zod-dto.util';

export class TransferProjectOwnershipDto extends createZodDto(
  TransferProjectOwnershipSchema,
) {}

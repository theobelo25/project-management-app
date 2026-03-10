import { TransferProjectOwnershipSchema } from '@repo/types';
import { createZodDto } from '@api/common';

export class TransferProjectOwnershipDto extends createZodDto(
  TransferProjectOwnershipSchema,
) {}

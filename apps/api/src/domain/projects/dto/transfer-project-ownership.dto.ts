import { TransferProjectOwnershipSchema, createZodDto } from '@repo/types';

export class TransferProjectOwnershipDto extends createZodDto(
  TransferProjectOwnershipSchema,
) {}

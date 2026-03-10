import { z } from "zod";

export const TransferProjectOwnershipSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
});

export type TransferProjectOwnershipDto = z.infer<
  typeof TransferProjectOwnershipSchema
>;

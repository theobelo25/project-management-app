import { z } from "zod";

export const CreateUserInputSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(200).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

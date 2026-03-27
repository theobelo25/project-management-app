import { z } from "zod";

export const CreateUserInputSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(200),
  passwordHash: z.string().min(1).max(50),
});

export type CreateUserInputDto = z.infer<typeof CreateUserInputSchema>;

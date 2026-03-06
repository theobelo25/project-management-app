import { z } from "zod";
import { CreateUserInputSchema } from "./create-user.schema";

export const UpdateUserInputSchema = CreateUserInputSchema.partial();

export type UpdateUserInputDto = z.infer<typeof UpdateUserInputSchema>;

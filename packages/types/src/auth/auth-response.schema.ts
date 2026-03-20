import { z } from "zod";
import { UserViewSchema } from "../user/user-response.schema";

export const AuthSessionSchema = z.object({
  user: UserViewSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

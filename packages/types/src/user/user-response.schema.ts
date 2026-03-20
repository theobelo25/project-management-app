import { z } from "zod";

export const UserViewSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  organizationName: z.string(),
  email: z.email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

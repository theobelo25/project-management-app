import { z } from "zod";

export const UserViewSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  organizationName: z.string(),
  email: z.email(),
  name: z.string(),
  createdAt: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.iso.datetime(),
  ),
  updatedAt: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.iso.datetime(),
  ),
});

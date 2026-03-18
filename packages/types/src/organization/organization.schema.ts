import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required"),
});

export const CreateOrganizationInviteSchema = z.object({
  email: z.string().email(),
});

export const AcceptOrganizationInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

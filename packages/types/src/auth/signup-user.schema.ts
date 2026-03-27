import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/,
    "Password must contain at least one special character",
  );

export const SignupRequestSchema = z
  .object({
    email: z.email(),
    name: z.string().min(1).max(200),
    password: passwordSchema,
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupRequestDto = z.infer<typeof SignupRequestSchema>;

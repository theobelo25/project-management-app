import { z } from "zod";

export const ThemeModeSchema = z.enum(["light", "dark", "system"]);
export const ColorSchemeSchema = z.enum([
  "default",
  "pastel-warm",
  "pastel-cool",
]);

export const UpdateUserInputSchema = z
  .object({
    email: z.email().optional(),
    name: z.string().min(1).max(200).optional(),
    passwordHash: z.string().min(1).max(255).optional(),
    themeMode: ThemeModeSchema.optional(),
    colorScheme: ColorSchemeSchema.optional(),
  })
  .strict();

export type UpdateUserInputDto = z.infer<typeof UpdateUserInputSchema>;

import { z } from "zod";

const ThemeModeSchema = z.enum(["light", "dark", "system"]);
const ColorSchemeSchema = z.enum(["default", "pastel-warm", "pastel-cool"]);

export const UserViewSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  organizationName: z.string(),
  email: z.email(),
  name: z.string(),
  themeMode: ThemeModeSchema.nullish(),
  colorScheme: ColorSchemeSchema.nullish(),
  createdAt: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.iso.datetime(),
  ),
  updatedAt: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.iso.datetime(),
  ),
});

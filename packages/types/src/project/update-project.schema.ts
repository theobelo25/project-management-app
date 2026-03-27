import { z } from "zod";

export const UpdateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .max(120, "Project name must be 120 characters or fewer")
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000, "Description must be 1000 characters or fewer")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;

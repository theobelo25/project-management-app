import { z } from "zod";

export const ProjectRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER"]);

/** Coerces null to undefined so response serialization matches `.optional()` (Zod rejects null on enums). */
export const OptionalProjectRoleSchema = z.preprocess(
  (v) => (v === null || v === undefined ? undefined : v),
  ProjectRoleSchema.optional(),
);

export type ProjectRole = z.infer<typeof ProjectRoleSchema>;

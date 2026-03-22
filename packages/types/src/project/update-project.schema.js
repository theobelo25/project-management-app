"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectSchema = void 0;
const zod_1 = require("zod");
exports.UpdateProjectSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, "Project name is required")
        .max(120, "Project name must be 120 characters or fewer")
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .max(1000, "Description must be 1000 characters or fewer")
        .nullable()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
//# sourceMappingURL=update-project.schema.js.map
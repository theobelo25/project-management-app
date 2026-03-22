"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectSchema = void 0;
const zod_1 = require("zod");
exports.CreateProjectSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, "Project name is required")
        .max(120, "Project name must be 120 characters or fewer"),
    description: zod_1.z
        .string()
        .trim()
        .max(1000, "Description must be 1000 characters or fewer")
        .optional(),
});
//# sourceMappingURL=create-project.schema.js.map
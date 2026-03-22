"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProjectsQuerySchema = exports.ProjectsSortSchema = exports.ProjectsFilterSchema = void 0;
const zod_1 = require("zod");
const booleanish = zod_1.z
    .union([zod_1.z.boolean(), zod_1.z.literal("true"), zod_1.z.literal("false")])
    .transform((value) => value === true || value === "true");
exports.ProjectsFilterSchema = zod_1.z.enum([
    "all",
    "owned",
    "member",
    "archived",
]);
exports.ProjectsSortSchema = zod_1.z.enum([
    "updated-desc",
    "created-desc",
    "name-asc",
]);
exports.GetProjectsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    includeArchived: booleanish.optional().default(false),
    search: zod_1.z
        .string()
        .optional()
        .transform((s) => (typeof s === "string" ? s.trim() || undefined : s)),
    filter: exports.ProjectsFilterSchema.optional().default("all"),
    sort: exports.ProjectsSortSchema.optional().default("updated-desc"),
});
//# sourceMappingURL=get-projects-query.schema.js.map
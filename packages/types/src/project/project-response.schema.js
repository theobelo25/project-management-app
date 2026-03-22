"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedProjectsViewSchema = exports.ProjectViewSchema = void 0;
const zod_1 = require("zod");
const project_role_schema_1 = require("./project-role.schema");
exports.ProjectViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    ownerId: zod_1.z.string(),
    archivedAt: zod_1.z.iso.datetime().nullable(),
    createdAt: zod_1.z.iso.datetime(),
    updatedAt: zod_1.z.iso.datetime(),
    currentUserRole: project_role_schema_1.ProjectRoleSchema.optional(),
});
exports.PaginatedProjectsViewSchema = zod_1.z.object({
    items: zod_1.z.array(exports.ProjectViewSchema),
    page: zod_1.z.number().int().min(1),
    pageSize: zod_1.z.number().int().min(1),
    total: zod_1.z.number().int().min(0),
    totalPages: zod_1.z.number().int().min(0),
});
//# sourceMappingURL=project-response.schema.js.map
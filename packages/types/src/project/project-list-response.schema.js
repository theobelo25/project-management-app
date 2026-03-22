"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedProjectsListViewSchema = exports.ProjectListItemViewSchema = exports.ProjectsListMemberSchema = void 0;
const zod_1 = require("zod");
const project_role_schema_1 = require("./project-role.schema");
exports.ProjectsListMemberSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    image: zod_1.z.string().nullable().optional(),
});
exports.ProjectListItemViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    ownerId: zod_1.z.string(),
    archivedAt: zod_1.z.iso.datetime().nullable(),
    createdAt: zod_1.z.iso.datetime(),
    updatedAt: zod_1.z.iso.datetime(),
    currentUserRole: project_role_schema_1.ProjectRoleSchema.optional(),
    totalTasks: zod_1.z.number().int().min(0),
    completedTasks: zod_1.z.number().int().min(0),
    openTasks: zod_1.z.number().int().min(0),
    members: zod_1.z.array(exports.ProjectsListMemberSchema),
});
exports.PaginatedProjectsListViewSchema = zod_1.z.object({
    items: zod_1.z.array(exports.ProjectListItemViewSchema),
    page: zod_1.z.number().int().min(1),
    pageSize: zod_1.z.number().int().min(1),
    total: zod_1.z.number().int().min(0),
    totalPages: zod_1.z.number().int().min(0),
});
//# sourceMappingURL=project-list-response.schema.js.map
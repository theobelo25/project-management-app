"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDetailViewSchema = exports.ProjectRecentTaskSchema = exports.ProjectDetailMemberSchema = void 0;
const zod_1 = require("zod");
const project_role_schema_1 = require("./project-role.schema");
const task_status_schema_1 = require("../task/task-status.schema");
const project_list_response_schema_1 = require("./project-list-response.schema");
exports.ProjectDetailMemberSchema = project_list_response_schema_1.ProjectsListMemberSchema.extend({
    email: zod_1.z.email().optional(),
});
exports.ProjectRecentTaskSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    status: task_status_schema_1.TaskStatusSchema,
});
exports.ProjectDetailViewSchema = zod_1.z.object({
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
    members: zod_1.z.array(exports.ProjectDetailMemberSchema),
    recentTasks: zod_1.z.array(exports.ProjectRecentTaskSchema),
});
//# sourceMappingURL=project-detail-response.schema.js.map
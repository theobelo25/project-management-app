"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedTasksViewSchema = exports.TaskViewSchema = exports.TaskAssignmentViewSchema = exports.TaskAssigneeViewSchema = void 0;
const zod_1 = require("zod");
const task_status_schema_1 = require("./task-status.schema");
const task_priority_schema_1 = require("./task-priority.schema");
exports.TaskAssigneeViewSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    assignedAt: zod_1.z.string().datetime(),
    user: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        email: zod_1.z.email(),
    }),
});
exports.TaskAssignmentViewSchema = zod_1.z.object({
    taskId: zod_1.z.uuid(),
    userId: zod_1.z.uuid(),
    assignedAt: zod_1.z.string().datetime(),
});
exports.TaskViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    projectId: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    status: task_status_schema_1.TaskStatusSchema,
    priority: task_priority_schema_1.TaskPrioritySchema,
    dueDate: zod_1.z.string().datetime().nullable(),
    position: zod_1.z.number().int(),
    createdById: zod_1.z.string(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    assignees: zod_1.z.array(exports.TaskAssigneeViewSchema),
});
exports.PaginatedTasksViewSchema = zod_1.z.object({
    items: zod_1.z.array(exports.TaskViewSchema),
    page: zod_1.z.number().int().min(1),
    pageSize: zod_1.z.number().int().min(1),
    total: zod_1.z.number().int().min(0),
    totalPages: zod_1.z.number().int().min(0),
});
//# sourceMappingURL=task-response.schema.js.map
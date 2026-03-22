"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindTasksQuerySchema = void 0;
const zod_1 = require("zod");
const pagination_schema_1 = require("../pagination/pagination.schema");
const task_priority_schema_1 = require("./task-priority.schema");
const task_status_schema_1 = require("./task-status.schema");
exports.FindTasksQuerySchema = pagination_schema_1.PaginationQuerySchema.extend({
    projectId: zod_1.z.uuid(),
    status: task_status_schema_1.TaskStatusSchema.optional(),
    priority: task_priority_schema_1.TaskPrioritySchema.optional(),
    assigneeId: zod_1.z.uuid().optional(),
    search: zod_1.z.string().trim().min(1).optional(),
    sort: zod_1.z
        .enum(["updated-desc", "created-desc", "title-asc", "status-asc"])
        .optional(),
});
//# sourceMappingURL=find-tasks-query.dto.js.map
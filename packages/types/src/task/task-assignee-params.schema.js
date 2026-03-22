"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssigneeParamsSchema = void 0;
const zod_1 = require("zod");
exports.TaskAssigneeParamsSchema = zod_1.z.object({
    taskId: zod_1.z.uuid(),
    userId: zod_1.z.uuid(),
});
//# sourceMappingURL=task-assignee-params.schema.js.map
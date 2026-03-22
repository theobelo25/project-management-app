"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusSchema = void 0;
const zod_1 = require("zod");
exports.TaskStatusSchema = zod_1.z.enum([
    "TODO",
    "IN_PROGRESS",
    "REVIEW",
    "DONE",
]);
//# sourceMappingURL=task-status.schema.js.map
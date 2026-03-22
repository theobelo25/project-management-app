"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskIdParamSchema = void 0;
const zod_1 = require("zod");
exports.TaskIdParamSchema = zod_1.z.object({
    taskId: zod_1.z.uuid(),
});
//# sourceMappingURL=task-id-param.schema.js.map
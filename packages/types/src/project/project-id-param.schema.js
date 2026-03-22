"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectIdParamSchema = void 0;
const zod_1 = require("zod");
exports.ProjectIdParamSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
});
//# sourceMappingURL=project-id-param.schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMemberParamSchema = void 0;
const zod_1 = require("zod");
exports.ProjectMemberParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Project id is required"),
    userId: zod_1.z.string().trim().min(1, "User id is required"),
});
//# sourceMappingURL=project-member-param.schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoleSchema = void 0;
const zod_1 = require("zod");
exports.ProjectRoleSchema = zod_1.z.enum(["OWNER", "ADMIN", "MEMBER"]);
//# sourceMappingURL=project-role.schema.js.map
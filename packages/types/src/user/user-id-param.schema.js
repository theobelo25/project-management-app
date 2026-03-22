"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdParamSchema = void 0;
const zod_1 = require("zod");
exports.UserIdParamSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
});
//# sourceMappingURL=user-id-param.schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidIdParamSchema = void 0;
const zod_1 = require("zod");
exports.UuidIdParamSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
});
//# sourceMappingURL=uuid-id-param.schema.js.map
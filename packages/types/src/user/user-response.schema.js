"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserViewSchema = void 0;
const zod_1 = require("zod");
exports.UserViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    orgId: zod_1.z.string(),
    organizationName: zod_1.z.string(),
    email: zod_1.z.email(),
    name: zod_1.z.string(),
    createdAt: zod_1.z.preprocess((val) => (val instanceof Date ? val.toISOString() : val), zod_1.z.iso.datetime()),
    updatedAt: zod_1.z.preprocess((val) => (val instanceof Date ? val.toISOString() : val), zod_1.z.iso.datetime()),
});
//# sourceMappingURL=user-response.schema.js.map